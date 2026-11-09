import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { archiveChat as archiveThunk, deleteChat as deleteThunk, getAllChats as listThunk, getChatById as getThunk, resetChatError, resetCurrentChat, sendMessage as sendThunk, updateChat as updateThunk } from '../chat.slice.js'
import { initializeSocket } from '../services/socket.service.js'

export const useChat = () => {

    const dispatch = useDispatch()
    const state = useSelector((store) => store.chat)
    return {
        ...state,
        sendMessage: useCallback((payload) => dispatch(sendThunk(payload)).unwrap(), [dispatch]),
        getAllChats: useCallback((isArchived = false) => dispatch(listThunk(isArchived)).unwrap(), [dispatch]),
        getChatById: useCallback((chatId) => dispatch(getThunk(chatId)).unwrap(), [dispatch]),
        updateChat: useCallback((chatId, data) => dispatch(updateThunk({ chatId, data })).unwrap(), [dispatch]),
        deleteChat: useCallback((chatId) => dispatch(deleteThunk(chatId)).unwrap(), [dispatch]),
        archiveChat: useCallback((chatId, isArchived) => dispatch(archiveThunk({ chatId, isArchived })).unwrap(), [dispatch]),
        resetCurrentChat: useCallback(() => dispatch(resetCurrentChat()), [dispatch]),
        resetChatError: useCallback(() => dispatch(resetChatError()), [dispatch]),
        initializeSocket
    }
}
