import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import './App.css'
import LandingPage from './components/LandingPage'
import AuthContainer from './components/Auth/AuthContainer'
import SimpleDashboard from './components/Dashboard/SimpleDashboard'
import HowItWorks from './components/HowItWorks'
import SupportedDiets from './components/SupportedDiets'
import ForProfessionals from './components/ForProfessinals';
import NutrientGlossary from './components/NutrientGlossary';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    
    if (token && savedUser) {
      try {
        setIsAuthenticated(true)
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Error parsing user data:', error)
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

  return (
    <Router>
      <div className="App">
        

        <Routes>
          <Route
            path="/"
            element={
              showAuth ? (
                <AuthContainer
                  onAuthSuccess={handleAuthSuccess}
                  onBackToLanding={handleBackToLanding}
                  isAuthenticated={isAuthenticated}
                  user={user}
                  onLogout={handleLogout}
                />
              ) : isAuthenticated ? (
                <SimpleDashboard 
                  user={user}
                  onLogout={handleLogout}
                />
              ) : (
                <LandingPage 
                  isAuthenticated={isAuthenticated}
                  user={user}
                  onLoginClick={handleAuthClick}
                  onSignUpClick={handleAuthClick}
                  onLogout={handleLogout}
                />
              )
            }
          />

          {/* Corrected paths */}
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/supported-diets" element={<SupportedDiets />} />
          <Route path="/for-professionals" element={<ForProfessionals />} />
          <Route path="/nutrient-glossary" element={<NutrientGlossary />} />



          
        </Routes>
      </div>
    </Router>
  )
}

export default App


