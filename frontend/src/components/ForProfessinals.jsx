import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import './ForProfessionals.css'


const ForProfessionals = ({ isAuthenticated, user, onLoginClick, onSignUpClick, onLogout }) => {
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
            <h1 onClick={handleLogoClick} className="clickable-logo">PrepPal</h1>
          </div>
          <nav className="nav">
            <Link to="/how-it-works">How It Works</Link>
              <Link to="/supported-diets">Supported Diets</Link>
              <Link to= "/for-professionals">For Professionals</Link>
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
               <span> For Professionals</span>
            </h1>
            <p className="hero-subtitle">
                Meal Planner isn’t just for individuals—it’s a powerful tool for nutritionists, dietitians, fitness trainers, and wellness coaches.  
        Streamline meal planning for your clients, optimize nutritional outcomes, and save hours of manual work.
            </p>
          </div>
        </div>
      </section>


{/* For Professionals Section */}
<section className="for-professionals" style={{ padding: "4rem 0", background: "#f5f7fa" }}>
  <div className="container">
    {/* Hero / Intro */}
    <div className="hero-content" style={{ textAlign: "center", marginBottom: "3rem" }}>
      <h1 style={{ marginBottom: "1rem", color: "#764ba2" }}>Powerful, Fast Meal Planning To Level Up Your Business</h1>
      <p style={{ maxWidth: "700px", margin: "0 auto", color: "#555" }}>
        Streamline your workflow with Meal Planner. Quickly create personalized meal plans, manage clients efficiently, and deliver professional nutrition guidance—all in one easy-to-use platform. Boost productivity and enhance client results with confidence.
      </p>
    </div>
            <div>
                <h1 style={{textAlign:'center', color: "#764ba2"}}>Why Professionals Choose Us</h1>
            </div>
<br/>
    {/* Benefits Grid */}

    <div className="benefits-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
      <div className="benefit-card" style={{
        background: "#fff", borderRadius: "16px", padding: "2rem", boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
        transition: "transform 0.3s"
      }}>
        <h4>📊 Professional Dashboard</h4>
        <p>Manage multiple clients in one place. Track their progress, dietary preferences, and health goals efficiently.</p>
      </div>

      <div className="benefit-card" style={{
        background: "#fff", borderRadius: "16px", padding: "2rem", boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
        transition: "transform 0.3s"
      }}>
        <h4>📝 Custom Meal Plans</h4>
        <p>Create personalized meal plans based on client needs, including calories, macronutrients, and dietary restrictions.</p>
      </div>

      <div className="benefit-card" style={{
        background: "#fff", borderRadius: "16px", padding: "2rem", boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
        transition: "transform 0.3s"
      }}>
        <h4>📈 Progress Tracking</h4>
        <p>Monitor client performance, nutritional compliance, and goal achievement with easy-to-read analytics.</p>
      </div>

      <div className="benefit-card" style={{
        background: "#fff", borderRadius: "16px", padding: "2rem", boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
        transition: "transform 0.3s"
      }}>
        <h4>⚡ Time-Saving Automation</h4>
        <p>Automatically generate grocery lists, meal schedules, and nutrition summaries to save hours of manual work.</p>
      </div>

      <div className="benefit-card" style={{
        background: "#fff", borderRadius: "16px", padding: "2rem", boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
        transition: "transform 0.3s"
      }}>
        <h4>🌐 Collaboration & Sharing</h4>
        <p>Share meal plans, updates, and recommendations with clients instantly. Keep communication simple and professional.</p>
      </div>

      <div className="benefit-card" style={{
        background: "#fff", borderRadius: "16px", padding: "2rem", boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
        transition: "transform 0.3s"
      }}>
        <h4>🔒 Data Security & Privacy</h4>
        <p>All client data is protected with industry-standard encryption and secure storage, ensuring privacy and compliance.</p>
      </div>
    </div>

    
  </div>
</section>

{/* who it for*/}
    <section style={{ background: "#f9f9f9", padding: "40px 20px" }}>
      <h1 style={{ fontSize: "28px", textAlign: "center", marginBottom: "20px", color:"#764ba2" }}>
        Who It’s For
      </h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        {/* Nutritionists & Dietitians */}
        <div
          style={{
            background: '#e2c9ef',
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            display: "flex",
            alignItems: "center",
            gap: "15px",
          }}
        >
          <span style={{ fontSize: "40px" }}>🥗</span>
          <p>
            <b>Nutritionists & Dietitians</b> – Simplify client management and deliver 
            evidence-based diet plans.
          </p>
        </div>

        {/* Fitness Trainers & Coaches */}
        <div
          style={{
            background: "#e2c9ef",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            display: "flex",
            alignItems: "center",
            gap: "15px",
          }}
        >
          <span style={{ fontSize: "40px" }}>💪</span>
          <p>
            <b>Fitness Trainers & Coaches</b> – Integrate meal plans with fitness 
            programs for better results.
          </p>
        </div>

        {/* Healthcare Professionals */}
        <div
          style={{
            background: "#e2c9ef",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            display: "flex",
            alignItems: "center",
            gap: "15px",
          }}
        >
          <span style={{ fontSize: "40px" }}>🏥</span>
          <p>
            <b>Healthcare Professionals</b> – Support patients with dietary guidance 
            to improve health outcomes.
          </p>
        </div>

        {/* Wellness Consultants */}
        <div
          style={{
            background: "#e2c9ef",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            display: "flex",
            alignItems: "center",
            gap: "15px",
          }}
        >
          <span style={{ fontSize: "40px" }}>🌿</span>
          <p>
            <b>Wellness Consultants</b> – Offer holistic solutions combining food, 
            lifestyle, and wellness.
          </p>
        </div>
      </div>
    </section>

<p className="closing">
          <h1 style={{fontSize: "28px"}}>Get Started Today</h1> <br/>

Meal Planner gives you the tools to work smarter, not harder.<br/>
🚀 Try it now and take your professional services to the next level!
        </p>

    
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

export default ForProfessionals