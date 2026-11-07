
import mongoose from 'mongoose';

import Chat from '../models/chat.model.js';
import Message from '../models/messages.model.js';
import Source from '../models/source.model.js';

import {
    generateAIResponse,
    generateChatTitle
} from '../services/ai.services.js';


// ============================================
// 1. SEND MESSAGE (Create / Continue Chat)
// ============================================


export const sendMessage = async (req, res) => {
    try {
        const { message, chatId, model } = req.body;

        // 1. Validate message
        if (
            typeof message !== 'string' ||
            !message.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: 'Message is required'
            });
        }

        const userId = req.user._id;

        let existingChat = null;
        let selectedModel = model || 'default';

        // 2. Check whether this is an existing chat
        if (chatId) {

            if (!mongoose.isValidObjectId(chatId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid chat ID'
                });
            }

            existingChat = await Chat.findOne({
                _id: chatId,
                user: userId
            });

            if (!existingChat) {
                return res.status(404).json({
                    success: false,
                    message: 'Chat not found'
                });
            }

            // Preserve existing model if frontend doesn't send one
            if (!model) {
                selectedModel = existingChat.model;
            }
        }

        // 3. Fetch previous conversation history
        let conversationHistory = [];

        if (existingChat) {

            const previousMessages = await Message.find({
                chat: existingChat._id
            })
                .select('role content')
                .sort({ createdAt: 1 })
                .lean();

            conversationHistory = previousMessages.map(msg => ({
                role: msg.role,
                content: msg.content
            }));
        }

        // 4. Add current user message
        conversationHistory.push({
            role: 'user',
            content: message.trim()
        });

        // 5. Generate AI response using conversation history
        const aiResponse = await generateAIResponse(
            conversationHistory
        );

        if (
            typeof aiResponse !== 'string' ||
            !aiResponse.trim()
        ) {
            throw new Error(
                'AI service returned an invalid response'
            );
        }

        // 6. Generate title for new chats
        let chatTitle = 'New chat';

        if (!existingChat) {
            try {
                chatTitle = await generateChatTitle(
                    message.trim()
                );
            } catch (error) {
                console.error(
                    'Chat title generation failed:',
                    error
                );
            }
        }

        // 7. Start MongoDB transaction
        const session = await mongoose.startSession();

        let savedChat;
        let savedMessages;

        try {
            session.startTransaction();

            // Create new chat
            if (!existingChat) {

                const [newChat] = await Chat.create(
                    [{
                        user: userId,
                        title: chatTitle || 'New chat',
                        model: selectedModel,
                        lastMessageAt: new Date()
                    }],
                    { session }
                );

                savedChat = newChat;

            } else {

                // Update existing chat
                savedChat = await Chat.findOneAndUpdate(
                    {
                        _id: existingChat._id,
                        user: userId
                    },
                    {
                        $set: {
                            lastMessageAt: new Date(),
                            model: selectedModel
                        }
                    },
                    {
                        new: true,
                        session
                    }
                );

                if (!savedChat) {
                    throw new Error('Chat no longer exists');
                }
            }

            // 8. Save user and assistant messages
            savedMessages = await Message.create(
                [
                    {
                        chat: savedChat._id,
                        role: 'user',
                        content: message.trim()
                    },
                    {
                        chat: savedChat._id,
                        role: 'ai',
                        content: aiResponse.trim(),
                        model: selectedModel
                    }
                ],
                {
                    session,
                    ordered: true
                }
            );

            // 9. Commit transaction
            await session.commitTransaction();

        } catch (error) {

            if (session.inTransaction()) {
                await session.abortTransaction();
            }

            throw error;

        } finally {
            await session.endSession();
        }

        // 10. Send response
        return res.status(201).json({
            success: true,
            message: 'Message sent successfully',
            chat: savedChat,
            messages: savedMessages
        });

    } catch (error) {

        console.error('Send Message Error:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to send message'
        });
    }
};



// ============================================
// 2. GET ALL CHATS
// ============================================

export const getAllChats = async (req, res) => {
    try {
        const userId = req.user._id;

        const filter = {
            user: userId
        };

        // Optional archived filter
        if (req.query.isArchived !== undefined) {
            if (!['true', 'false'].includes(req.query.isArchived)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid archive filter'
                });
            }

            filter.isArchived = req.query.isArchived === 'true';
        }

        const chats = await Chat.find(filter)
            .sort({ updatedAt: -1 })
            .lean();

        return res.status(200).json({
            success: true,
            count: chats.length,
            chats
        });

    } catch (error) {
        console.error('Get All Chats Error:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to fetch chats'
        });
    }
};


// ============================================
// 3. GET CHAT BY ID
// ============================================

export const getChatById = async (req, res) => {
    try {
        const { chatId } = req.params;
        const userId = req.user._id;

        if (!mongoose.isValidObjectId(chatId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid chat ID'
            });
        }

        // Find chat belonging to logged-in user
        const chat = await Chat.findOne({
            _id: chatId,
            user: userId
        }).lean();

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: 'Chat not found'
            });
        }

        // Fetch messages and their associated sources
        const messages = await Message.find({
            chat: chatId
        })
            .populate('sources')
            .sort({ createdAt: 1 })
            .lean();

        return res.status(200).json({
            success: true,
            chat,
            messages
        });

    } catch (error) {
        console.error('Get Chat Error:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to fetch chat'
        });
    }
};


// ============================================
// 4. UPDATE CHAT
// ============================================

export const updateChat = async (req, res) => {
    try {
        const { chatId } = req.params;
        const { title, description } = req.body;

        if (!mongoose.isValidObjectId(chatId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid chat ID'
            });
        }

        const updates = {};

        // Only allow title and description updates
        if (title !== undefined) {
            if (typeof title !== 'string' || !title.trim()) {
                return res.status(400).json({
                    success: false,
                    message: 'Chat title cannot be empty'
                });
            }

            updates.title = title.trim();
        }

        if (description !== undefined) {
            if (
                description !== null &&
                typeof description !== 'string'
            ) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid chat description'
                });
            }

            updates.description = description?.trim() || '';
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Provide a title or description to update'
            });
        }

        const updatedChat = await Chat.findOneAndUpdate(
            {
                _id: chatId,
                user: req.user._id
            },
            {
                $set: updates
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedChat) {
            return res.status(404).json({
                success: false,
                message: 'Chat not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Chat updated successfully',
            chat: updatedChat
        });

    } catch (error) {
        console.error('Update Chat Error:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to update chat'
        });
    }
};


// ============================================
// 5. DELETE CHAT
// ============================================

export const deleteChat = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        const { chatId } = req.params;

        if (!mongoose.isValidObjectId(chatId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid chat ID'
            });
        }

        session.startTransaction();

        // Verify chat ownership
        const chat = await Chat.findOne({
            _id: chatId,
            user: req.user._id
        }).session(session);

        if (!chat) {
            await session.abortTransaction();

            return res.status(404).json({
                success: false,
                message: 'Chat not found'
            });
        }

        // Find all messages belonging to this chat
        const messages = await Message.find({
            chat: chatId
        })
            .select('_id')
            .session(session);

        const messageIds = messages.map(message => message._id);

        // Delete all sources belonging to those messages
        await Source.deleteMany({
            message: { $in: messageIds }
        }).session(session);

        // Delete all messages
        await Message.deleteMany({
            chat: chatId
        }).session(session);

        // Delete the chat
        await Chat.deleteOne({
            _id: chatId,
            user: req.user._id
        }).session(session);

        await session.commitTransaction();

        return res.status(200).json({
            success: true,
            message: 'Chat and its messages deleted successfully'
        });

    } catch (error) {
        if (session.inTransaction()) {
            await session.abortTransaction();
        }

        console.error('Delete Chat Error:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to delete chat'
        });

    } finally {
        await session.endSession();
    }
};


// ============================================
// 6. ARCHIVE / UNARCHIVE CHAT
// ============================================

export const archiveChat = async (req, res) => {
    try {
        const { chatId } = req.params;
        const { isArchived } = req.body;

        if (!mongoose.isValidObjectId(chatId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid chat ID'
            });
        }

        if (typeof isArchived !== 'boolean') {
            return res.status(400).json({
                success: false,
                message: 'isArchived must be true or false'
            });
        }

        const chat = await Chat.findOneAndUpdate(
            {
                _id: chatId,
                user: req.user._id
            },
            {
                $set: { isArchived }
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: 'Chat not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: isArchived
                ? 'Chat archived successfully'
                : 'Chat unarchived successfully',
            chat
        });

    } catch (error) {
        console.error('Archive Chat Error:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to update archive status'
        });
    }
};
