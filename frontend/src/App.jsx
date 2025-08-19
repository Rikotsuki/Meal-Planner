import React, { useState, useEffect } from 'react'
import './App.css'
import LandingPage from './components/LandingPage'
import AuthContainer from './components/Auth/AuthContainer'
import SimpleDashboard from './components/Dashboard/SimpleDashboard'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    
    if (token && savedUser) {
      try {
        setIsAuthenticated(true)
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Error parsing user data:', error)
        // Clear invalid data
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('refreshToken')
      }
    }
  }, [])

  const handleAuthSuccess = (data) => {
    setIsAuthenticated(true)
    setUser(data.user)
    setShowAuth(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsAuthenticated(false)
    setUser(null)
  }

  const handleAuthClick = () => {
    setShowAuth(true)
  }

  const handleBackToLanding = () => {
    setShowAuth(false)
  }

  if (showAuth) {
    return (
      <div className="App">
        <AuthContainer 
          onAuthSuccess={handleAuthSuccess}
          onBackToLanding={handleBackToLanding}
          isAuthenticated={isAuthenticated}
          user={user}
          onLogout={handleLogout}
        />
      </div>
    )
  }

  if (isAuthenticated) {
    return (
      <div className="App">
        <SimpleDashboard 
          user={user}
          onLogout={handleLogout}
        />
      </div>
    )
  }

  return (
    <div className="App">
      <LandingPage 
        isAuthenticated={isAuthenticated}
        user={user}
        onLoginClick={handleAuthClick}
        onSignUpClick={handleAuthClick}
        onLogout={handleLogout}
      />
    </div>
  )
}

export default App

