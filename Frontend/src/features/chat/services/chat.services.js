import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3000/api/chat',
    withCredentials: true
})

export async function sendMessage(message) {
    try {
        const response = await api.post('/message', message)
        return response.data
    } catch (error) {
        throw error.response.data
    }
}

export async function getAllChats(isArchived = false) {
    try {
        const response = await api.get('/', { params: { isArchived } })
        return response.data
    } catch (error) {
        throw error.response.data
    }
}

export async function getChatById(chatId) {
    try {
        const response = await api.get(`/${chatId}`)
        return response.data
    } catch (error) {
        throw error.response.data
    }
}

export async function updateChat(chatId, updates) {
    try {
        const response = await api.patch(`/${chatId}`, updates)
        return response.data
    } catch (error) {
        throw error.response.data
    }
}

export async function deleteChat(chatId) {
    try {
        const response = await api.delete(`/${chatId}`)
        return response.data
    } catch (error) {
        throw error.response.data
    }
}

export async function archiveChat(chatId, archive) {
    try {
        const response = await api.patch(`/${chatId}/archive`, { isArchived: archive })
        return response.data
    } catch (error) {
        throw error.response.data
    }
}
