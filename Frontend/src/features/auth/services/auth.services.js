import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3000/api/auth',
    withCredentials: true
})

export async function registerUser(email, username, password) {
    try {
        const response = await api.post('/register', { email, username, password })
        return response.data
    } catch (error) {
        throw error.response.data
    }
}

export async function loginUser(email, password) {
    try {
        const response = await api.post('/login', { email, password })
        return response.data
    } catch (error) {
        throw error.response.data
    }
}

export async function getMe() {
    try {
        const response = await api.get('/get-me')
        return response.data
    } catch (error) {
        throw error.response.data
    }
}

export async function logoutUser() {
    try {
        const response = await api.post('/logout')
        return response.data
    } catch (error) {
        throw error.response.data
    }
}