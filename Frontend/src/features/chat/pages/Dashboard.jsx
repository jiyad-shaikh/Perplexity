import React from 'react'
import { useSelector } from 'react-redux'

const Dashboard = () => {

    const user = useSelector((state) => state.auth.user)
    console.log('User from Redux store:', user) // Log the user object to check its value

  return (
    <div>
        <h1>Dashboard</h1>
    </div>
  )
}

export default Dashboard
