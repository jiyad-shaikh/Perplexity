import React from 'react'
import { useSelector } from 'react-redux'
import { useChat } from '../hooks/useChat.js'
import { useEffect } from 'react'

const Dashboard = () => {
    const chat = useChat();

    const user = useSelector((state) => state.auth.user)
    console.log('User from Redux store:', user) // Log the user object to check its value

    useEffect(() => {
            chat.initializeSocket();
    }, []);

  return (
    <div>
        <h1>Dashboard</h1>
    </div>
  )
}

export default Dashboard
