import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import './SupportedDiets.css'


{/* Inline style for cards */}
const cardStyle = {
  background: "#fff",
  borderRadius: "16px",
  padding: "2rem",
  boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
  transition: "transform 0.3s",
};

const SupportedDiets = ({ isAuthenticated, user, onLoginClick, onSignUpClick, onLogout }) => {
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
               <span> The Types of Diets We Support</span>
            </h1>
            <p className="hero-subtitle">
            PrepPal supports a wide variety of diets to help you achieve your health, fitness, and lifestyle goals. 
      Whether you want to lose weight, build muscle, improve overall health, or just eat mindfully, we’ve got you covered.
            </p>
          </div>
        </div>
      </section>


{/* Supported Diets Section */}
<section className="supported-diets" style={{ padding: "4rem 0", background: "#f8f9fa" }}>
  <div className="container">
    <h1 style={{ textAlign: "center", marginBottom: "2rem", color: "#764ba2" }}>
        Which Type of Diet Should You Follow?
    </h1>
     <p style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto 3rem", color: "#555" }}>
      Choosing the right diet depends on your goals, preferences, and health needs. Use our planner to find the diet that fits you best:
    </p>
         <p style={{ textAlign: "justify", maxWidth: "450px", margin: "0 auto 3rem", color: "#555" }}>
            <ul>
        <li><strong>Weight management:</strong> Low Carb, Low Fat, Keto </li>
      <li><strong> Heart health & longevity:</strong> Mediterranean, Vegan, Vegetarian</li>
      <li><strong>Muscle building:</strong> High Protein</li>
      <li><strong>Special needs:</strong> Gluten-Free, Paleo</li>
            </ul>
        
      </p>
    

    <div className="diets-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
      <div className="diet-card" style={cardStyle}>
        <h4>🥓 Keto</h4>
        <p>Low-carb, high-fat diet that puts your body into ketosis to burn fat efficiently. Ideal for rapid weight loss.</p>
      </div>
      <div className="diet-card" style={cardStyle}>
        <h4>🌱 Vegan</h4>
        <p>Completely plant-based diet with no animal products. Focuses on vegetables, fruits, legumes, and grains.</p>
      </div>
      <div className="diet-card" style={cardStyle}>
        <h4>🥚 Vegetarian</h4>
        <p>Excludes meat but may include dairy and eggs. Supports heart health, weight management, and sustainability.</p>
      </div>
      <div className="diet-card" style={cardStyle}>
        <h4>🥩 Paleo</h4>
        <p>Based on foods eaten by early humans: meat, fish, fruits, vegetables, and nuts. Avoids processed foods and sugars.</p>
      </div>
      <div className="diet-card" style={cardStyle}>
        <h4>🌊 Mediterranean</h4>
        <p>Rich in fruits, vegetables, whole grains, olive oil, and fish. Supports heart health and longevity.</p>
      </div>
      <div className="diet-card" style={cardStyle}>
        <h4>🥗 Low Carb</h4>
        <p>Reduces carbohydrate intake to promote fat burning and stabilize blood sugar. Great for weight loss and diabetes management.</p>
      </div>
      <div className="diet-card" style={cardStyle}>
        <h4>🍞 Low Fat</h4>
        <p>Focuses on reducing fat intake while keeping a balanced diet. Often used for weight loss and heart health.</p>
      </div>
      <div className="diet-card" style={cardStyle}>
        <h4>💪 High Protein</h4>
        <p>Emphasizes protein-rich foods for muscle building, satiety, and metabolism support. Perfect for athletes and fitness enthusiasts.</p>
      </div>
      <div className="diet-card" style={cardStyle}>
        <h4>🚫 Gluten-Free</h4>
        <p>Eliminates gluten-containing grains for those with celiac disease or gluten sensitivity. Includes naturally gluten-free grains, fruits, and vegetables.</p>
      </div>
     
    </div>
  </div>
</section>



      
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

export default SupportedDiets