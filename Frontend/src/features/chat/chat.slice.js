import { createSlice } from '@reduxjs/toolkit'

export const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        chat: {},
        currentChatId: null,
        loading: true, 
        error: null
    },
    reducers: {
        setChat: (state, action) => {
            state.chat = action.payload
        },

        setCurrentChatId: (state, action) => {
            state.currentChatId = action.payload
        },

        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        }
    }
})

export const { setChat, setCurrentChatId, setLoading, setError } = chatSlice.actions

export default chatSlice.reducer