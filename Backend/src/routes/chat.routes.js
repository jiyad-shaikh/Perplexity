
import express from 'express';

import {
    sendMessage,
    getAllChats,
    getChatById,
    updateChat,
    deleteChat,
    archiveChat
} from '../controllers/chat.controller.js';

import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// All chat routes require authentication
router.use(protect);

// Create a new chat or continue an existing chat
router.post('/message', sendMessage);

// Get all chats of logged-in user
router.get('/', getAllChats);

// Get a particular chat with messages and sources
router.get('/:chatId', getChatById);

// Update chat title or description
router.patch('/:chatId', updateChat);

// Delete chat and associated messages/sources
router.delete('/:chatId', deleteChat);

// Archive or unarchive chat
router.patch('/:chatId/archive', archiveChat);

export default router;
