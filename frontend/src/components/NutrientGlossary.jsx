import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import './NutrientGlossary.css'

const NutrientGlossary = ({ isAuthenticated, user, onLoginClick, onSignUpClick, onLogout }) => {
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
               <span>Nutrient Glossary</span>
            </h1>
            <p className="hero-subtitle">
             Welcome to our Nutrient Glossary! Here you’ll find simple explanations of important nutrients, their roles in your body, recommended daily intake, and the foods that provide them. Knowing these will help you make healthier choices and better manage your meal plans.
            </p>
          </div>
        </div>
      </section>


{/* Who We Are Section */}
<section style={{ display: 'flex', justifyContent: 'center', padding: '2rem 1rem', backgroundColor: '#ffffff' }}>
  <div style={{ maxWidth: '1200px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '2rem' }}>

    {/* Text Content */}
    <div style={{ flex: '1 1 500px', minWidth: '300px' }}>
      <h1 style={{color: "#764ba2"}}>
        Why is it important to eat a balanced diet, and how does it benefit the body and mind?
      </h1><br/>
      <p style={{ fontSize: '1rem', lineHeight: '1.8', color: '#333', marginBottom: '1rem' }}>
          Eating a balanced diet is important because it provides the body with all the essential nutrients it needs to function properly. Carbohydrates, proteins, and fats give energy for daily activities, while vitamins and minerals support growth, repair tissues, and keep the immune system strong. Without a balance of these nutrients, the body can become weak, and health problems like anemia, rickets, or fatigue may occur.
      </p>
      <p style={{ fontSize: '1rem', lineHeight: '1.8', color: '#333', marginBottom: '1.5rem' }}>
       A balanced diet also helps maintain a healthy weight, supports brain function, and improves mental well-being. Nutrients like omega-3 fatty acids, B vitamins, and minerals help with concentration, memory, and mood regulation. Overall, eating all nutrients in the right amounts keeps the body strong, prevents diseases, and allows you to stay active and healthy.
      </p>
      
    </div>

    

  </div>
  


</section>

  <h1 style={{color: "#764ba2", textAlign: 'center'}}>Essential Nutrients and Their Role in Health</h1>


<section style={{ display: 'flex', justifyContent: 'center', padding: '1rem 1rem', backgroundColor: '#ffffff' }}>

  <div style={{ maxWidth: '1200px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '2rem' }}>
    {/* Text Content */}
    <div style={{ flex: '1 1 500px', minWidth: '300px', border: "2px solid #ffffff", padding: "10px", borderRadius: "8px" , boxShadow: "4px 4px 12px rgba(0, 0, 0, 0.3)",}}>

      <h1 style={{color: "#764ba2"}}>Calories</h1>
      <p style={{ fontSize: '1rem', lineHeight: '1.8', color: '#333', marginBottom: '1rem', }}>
        A calorie is a unit of energy that measures how much energy food provides to the body. The body uses calories to perform all its functions, from basic processes like breathing and circulation to physical activities like walking or exercising. Consuming more calories than the body burns leads to weight gain, while consuming fewer calories can cause weight loss.
      </p>
        
      <h1 style={{color: "#764ba2"}}>Macronutrients</h1>
      <p style={{ fontSize: '1rem', lineHeight: '1.8', color: '#333', marginBottom: '1rem', }}>
        Macronutrients are nutrients required in large amounts for energy and bodily functions. They include carbohydrates, proteins, and fats. Carbohydrates provide quick energy, proteins support growth and repair of tissues, and fats supply long-term energy and help absorb certain vitamins.
      </p>

        <h1 style={{color: "#764ba2"}}>Micronutrients</h1>
      <p style={{ fontSize: '1rem', lineHeight: '1.8', color: '#333', marginBottom: '1rem', }}>
        Micronutrients are nutrients needed in smaller amounts but are crucial for health. They include vitamins and minerals. Though required in tiny quantities, they play vital roles in metabolism, immune function, and overall growth and development.
      </p>

         <h1 style={{color: "#764ba2"}}>Sugars</h1>
      <p style={{ fontSize: '1rem', lineHeight: '1.8', color: '#333', marginBottom: '1rem', }}>
      Sugars are simple carbohydrates that provide rapid energy to the body. They can be naturally present in fruits and dairy or added to processed foods. While they are a quick energy source, excessive sugar intake can lead to weight gain, diabetes, and dental problems.
      </p>

         <h1 style={{color: "#764ba2"}}>Fats</h1>
      <p style={{ fontSize: '1rem', lineHeight: '1.8', color: '#333', marginBottom: '1rem', }}>
      Fats are a concentrated source of energy and are essential for protecting organs, insulating the body, and absorbing fat-soluble vitamins. Healthy fats, such as unsaturated fats from nuts and fish, support heart health, whereas excessive saturated and trans fats can increase the risk of heart disease.
      </p>

        <h1 style={{color: "#764ba2"}}>Minerals</h1>
      <p style={{ fontSize: '1rem', lineHeight: '1.8', color: '#333', marginBottom: '1rem', }}>
      Minerals are inorganic nutrients essential for various body functions, including building strong bones, transmitting nerve impulses, and regulating fluid balance. Important minerals include calcium, potassium, iron, and magnesium.
      </p>

        <h1 style={{color: "#764ba2"}}>Vitamins</h1>
      <p style={{ fontSize: '1rem', lineHeight: '1.8', color: '#333', marginBottom: '1rem', }}>
      Vitamins are organic compounds that regulate body processes and maintain health. Each vitamin has a specific role, such as vitamin C supporting immunity, vitamin D aiding calcium absorption, and vitamin A promoting vision and skin health.
      </p>

        <h1 style={{color: "#764ba2"}}>Fatty Acids</h1>
      <p style={{ fontSize: '1rem', lineHeight: '1.8', color: '#333', marginBottom: '1rem', }}>
      Fatty acids are the building blocks of fats. They can be saturated, unsaturated, or trans fats. Essential fatty acids, like omega-3 and omega-6, must be obtained from food and are important for brain function, inflammation regulation, and cardiovascular health.
      </p>

        <h1 style={{color: "#764ba2"}}>Amino Acids</h1>
      <p style={{ fontSize: '1rem', lineHeight: '1.8', color: '#333', marginBottom: '1rem', }}>
      Amino acids are the building blocks of proteins. The body uses them to create enzymes, hormones, and muscles. Some amino acids are essential, meaning they must be consumed through diet, while others are non-essential and can be produced by the body.
      </p>

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

export default NutrientGlossary
