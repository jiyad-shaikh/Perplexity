import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as chatService from './services/chat.services.js'

const errorMessage = (error) => error?.message || error?.error || 'Something went wrong. Please try again.'
const request = (fn) => async (args, { rejectWithValue }) => { try { return await fn(args) } catch (error) { return rejectWithValue(errorMessage(error)) } }

export const sendMessage = createAsyncThunk('chat/sendMessage', request(({ message, chatId = null, model }) => chatService.sendMessage({ message, chatId, model })))

export const getAllChats = createAsyncThunk('chat/getAllChats', request((isArchived = false) => chatService.getAllChats(isArchived)))

export const getChatById = createAsyncThunk('chat/getChatById', request((chatId) => chatService.getChatById(chatId)))
export const updateChat = createAsyncThunk('chat/updateChat', request(({ chatId, data }) => chatService.updateChat(chatId, data)))

export const deleteChat = createAsyncThunk('chat/deleteChat', async (chatId, { rejectWithValue }) => { try { await chatService.deleteChat(chatId); return chatId } catch (error) { return rejectWithValue(errorMessage(error)) } })

export const archiveChat = createAsyncThunk('chat/archiveChat', request(({ chatId, isArchived }) => chatService.archiveChat(chatId, isArchived)))

const initialState = { chats: [], currentChat: null, currentChatId: null, loading: false, sendingMessage: false, error: null }
const upsert = (chats, chat) => chat?._id ? [chat, ...chats.filter((item) => item._id !== chat._id)] : chats

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        resetCurrentChat: (state) => { state.currentChat = null; state.currentChatId = null },
        resetChatError: (state) => { state.error = null }
    },
    extraReducers: (builder) => {
        builder.addCase(sendMessage.pending, (state) => { state.sendingMessage = true; state.error = null })
            .addCase(sendMessage.fulfilled, (state, action) => { const { chat, messages = [] } = action.payload; state.sendingMessage = false; state.currentChat = { ...chat, messages }; state.currentChatId = chat?._id || state.currentChatId; state.chats = upsert(state.chats, chat) })
            .addCase(sendMessage.rejected, (state, action) => { state.sendingMessage = false; state.error = action.payload || action.error.message })
            .addCase(getAllChats.pending, (state) => { state.loading = true; state.error = null })
            .addCase(getAllChats.fulfilled, (state, action) => { state.loading = false; state.chats = action.payload?.chats || [] })
            .addCase(getAllChats.rejected, (state, action) => { state.loading = false; state.error = action.payload || action.error.message })
            .addCase(getChatById.pending, (state) => { state.loading = true; state.error = null })
            .addCase(getChatById.fulfilled, (state, action) => { const { chat, messages = [] } = action.payload; state.loading = false; state.currentChat = { ...chat, messages }; state.currentChatId = chat?._id || null; state.chats = upsert(state.chats, chat) })
            .addCase(getChatById.rejected, (state, action) => { state.loading = false; state.error = action.payload || action.error.message })
            .addCase(updateChat.fulfilled, (state, action) => { const chat = action.payload?.chat; state.chats = upsert(state.chats, chat); if (state.currentChatId === chat?._id) state.currentChat = { ...state.currentChat, ...chat } })
            .addCase(updateChat.rejected, (state, action) => { state.error = action.payload || action.error.message })
            .addCase(deleteChat.fulfilled, (state, action) => { state.chats = state.chats.filter((chat) => chat._id !== action.payload); if (state.currentChatId === action.payload) { state.currentChat = null; state.currentChatId = null } })
            .addCase(deleteChat.rejected, (state, action) => { state.error = action.payload || action.error.message })
            .addCase(archiveChat.fulfilled, (state, action) => { const chat = action.payload?.chat; state.chats = upsert(state.chats, chat); if (state.currentChatId === chat?._id) state.currentChat = { ...state.currentChat, ...chat } })
            .addCase(archiveChat.rejected, (state, action) => { state.error = action.payload || action.error.message })
    }
})

export const { resetCurrentChat, resetChatError } = chatSlice.actions
export default chatSlice.reducer
