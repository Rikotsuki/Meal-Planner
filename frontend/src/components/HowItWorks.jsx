import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import './HowItWorks.css'

const HowItWorks = ({ isAuthenticated, user, onLoginClick, onSignUpClick, onLogout }) => {
  const [selectedDiet, setSelectedDiet] = useState('Eat Everything')
  const [calories, setCalories] = useState('2000')
  const [meals, setMeals] = useState('3')
  const [carbs, setCarbs] = useState('90')
  const [fat, setFat] = useState('40')
  const [protein, setProtein] = useState('90')

  const diets = ['Eat Everything', 'Vegan', 'Halal']

  const handleGenerate = () => {
    console.log('Generating meal plan with:', {
      diet: selectedDiet,
      calories,
      meals,
      carbs,
      fat,
      protein
    })
    // TODO: Connect to backend API
  }

  const handleLogoClick = () => {
    // Scroll to top of the page when logo is clicked
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="logo">
            <h1 onClick={handleLogoClick} className="clickable-logo">Prep Pal</h1>
          </div>
          <nav className="nav">
            <Link to="/how-it-works">How It Works</Link>
              <Link to="/supported-diets">Supported Diets</Link>
            <Link to="/for-professionals">For Professionals</Link>
            {isAuthenticated ? (
              <div className="user-menu">
                <span className="user-greeting">Hello, {user?.name || 'User'}!</span>
                <button className="btn-secondary" onClick={onLogout}>Sign Out</button>
              </div>
            ) : (
              <>
                <button className="btn-secondary" onClick={onSignUpClick}>Sign Up</button>
                <button className="btn-primary" onClick={onLoginClick}>Sign In</button>
              </>
            )}
          </nav>
        </div>
      </header>

{/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
               <span>How It Works</span>
            </h1>
            <p className="hero-subtitle">
             Our Meal Planner "PrepPal" helps you create, save, and manage personalized meal
          plans, track nutrition, and make grocery shopping easier. Here’s how
          you can get started in just a few steps.
            </p>
          </div>
        </div>
      </section>



      {/* Main Content */}
      <main className="howitworks-content">

        <div className="steps">
          <section className="step">
            <h2>Step 1 – Create Your Account</h2>
            <p>
              Sign up with your email and password or log in if you already have
              an account. Once logged in, you’ll have access to all features.
            </p>
          </section>

          <section className="step">
            <h2>Step 2 – Generate Your Meal Plan</h2>
            <p>
              Click <b>“Generate Meal Plan”</b> to get a personalized plan based
              on your needs. Plans can be tailored to your goals, preferences,
              and nutrition requirements.
            </p>
          </section>

          <section className="step">
            <h2>Step 3 – Manage Your Plans</h2>
            <p>
              Go to <b>"My Plan"</b> to view your saved meal plans. You can{" "}
              <b>delete</b> any plan you no longer need. Generate and save
              multiple plans anytime.
            </p>
          </section>

          <section className="step">
            <h2>Step 4 – Explore Nutrition & Grocery List</h2>
            <p>
              <b>Nutrition</b> → Learn about the nutritional details of your
              meals. <br />
              <b>Grocery List</b> → Automatically get a shopping list so you
              know exactly what to buy.
            </p>
          </section>

          <section className="step">
            <h2>Step 5 – Edit Your Profile</h2>
            <p>
              Update your personal details in the <b>Profile</b> section. This
              helps the system give you more accurate meal recommendations.
            </p>
          </section>
        </div>

        <div className="extras" >
          <h2 style={{color: "#764ba2"}}>Extra Tools in the Footer</h2>
          <ul>
            <li>
              <b>Nutrient Glossary</b> → Learn about nutrients and what your
              body needs.
            </li>
          </ul>
        </div>

        <p className="closing">
          With just a few clicks, you can take control of your meals, your
          nutrition, and your health. Start planning your next meal today!
        </p>
      </main>
        
      {/*cta*/}
      
        <div className="container" 
               style={{
        background: '#ffffff', // solid white
        padding: '2rem 0',
        textAlign: 'center'
      }}>
                  {!isAuthenticated ? (
            <button className="btn-primary large" onClick={onSignUpClick}>Create a free account →</button>
          ) : (
            <button className="btn-primary large" onClick={handleGenerate}>Generate Your Meal Plan →</button>
          )}
            </div>
      
              

{/* Footer Section */}
<footer
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
       color: 'white',
  padding: '4rem 0 2rem'
      }}>
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <h2>PrepPal</h2>
              <p>Your personalized nutrition assistant</p>
            </div>
            
            <div className="footer-links">
              <div className="link-group">
                <h3>Nutrition</h3>
                <Link to = "/nutrient-glossary">Nutrient Glossary</Link>
                
              </div>
              
              <div className="link-group">
                <h3>About & Help</h3>
                <a href="#about">About Us</a>
                <a href="#blog">Contact Us</a>
                <a href="#careers">FAQ</a>
              </div>
              
              <div className="link-group">
                <h3>Legal</h3>
                <a href="#privacy">Privacy Policy</a>
                <a href="#terms">Terms of Service</a>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} PrepPal. All rights reserved.</p>
            <div className="social-links">
              <a href="#facebook" aria-label="Facebook">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#twitter" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#instagram" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#linkedin" aria-label="LinkedIn">
                <i className="fab fa-linkedin"></i>
              </a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}

export default HowItWorks