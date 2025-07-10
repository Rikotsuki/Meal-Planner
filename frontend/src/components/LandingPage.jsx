import React, { useState } from 'react'
import './LandingPage.css'

const LandingPage = () => {
  const [selectedDiet, setSelectedDiet] = useState('Anything')
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

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="logo">
            <h1>Meal Planner</h1>
          </div>
          <nav className="nav">
            <a href="#how-it-works">How It Works</a>
            <a href="#supported-diets">Supported Diets</a>
            <a href="#for-professionals">For Professionals</a>
            <button className="btn-secondary">Sign Up</button>
            <button className="btn-primary">Sign In</button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Put your diet on <span className="highlight">autopilot.</span>
            </h1>
            <p className="hero-subtitle">
              Meal Planner creates personalized meal plans based on your food preferences, 
              budget, and schedule. Reach your diet and nutritional goals with our calorie 
              calculator, weekly meal plans, grocery lists and more.
            </p>
          </div>
        </div>
      </section>

      {/* Meal Plan Generator */}
      <section className="meal-generator">
        <div className="container">
          <h2 className="section-title">Create your meal plan right here in seconds</h2>
          
          <div className="generator-form">
            <div className="form-row">
              <div className="form-group">
                <label>Preferred Diet</label>
                <div className="diet-buttons">
                  {diets.map(diet => (
                    <button
                      key={diet}
                      className={selectedDiet === diet ? 'active' : ''}
                      onClick={() => setSelectedDiet(diet)}
                    >
                      {diet}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>I want to eat</label>
                <div className="input-group">
                  <input
                    type="number"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    className="calorie-input"
                  />
                  <span>calories</span>
                </div>
                <small>Not sure? Try our Calorie Calculator</small>
              </div>
              <div className="form-group">
                <label>in</label>
                <div className="input-group">
                  <input
                    type="number"
                    value={meals}
                    onChange={(e) => setMeals(e.target.value)}
                    className="meal-input"
                  />
                  <span>meals</span>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>At least</label>
                <div className="macro-inputs">
                  <div className="macro-input">
                    <input
                      type="number"
                      value={carbs}
                      onChange={(e) => setCarbs(e.target.value)}
                    />
                    <span>Carbs</span>
                  </div>
                  <div className="macro-input">
                    <input
                      type="number"
                      value={fat}
                      onChange={(e) => setFat(e.target.value)}
                    />
                    <span>Fat</span>
                  </div>
                  <div className="macro-input">
                    <input
                      type="number"
                      value={protein}
                      onChange={(e) => setProtein(e.target.value)}
                    />
                    <span>Protein</span>
                  </div>
                </div>
                <small>Want to set specific macro targets? Create a free account!</small>
              </div>
            </div>

            <button className="generate-btn" onClick={handleGenerate}>
              Generate
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Eating smart has never been easier</h2>
          
          <div className="features-grid">
            <div className="feature-card">
              <h3>Follow any eating style or create your own</h3>
              <p>You can customize popular eating styles like vegan and paleo to match your needs and preferences.</p>
            </div>
            
            <div className="feature-card">
              <h3>Reduce food waste</h3>
              <p>Planning ahead means less produce going bad in the fridge. Add what you already own to the virtual pantry and our algorithms will use it up with priority.</p>
            </div>
            
            <div className="feature-card">
              <h3>Take the anxiety out of picking what to eat</h3>
              <p>Make the important decisions ahead of time and on your own schedule. Then there's nothing to worry about when it's time to eat.</p>
            </div>
            
            <div className="feature-card">
              <h3>Automatic grocery lists</h3>
              <p>No more skipping meals because you're missing ingredients. Review your meals for the week and the grocery list automatically updates.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <button className="btn-primary large">Create a free account →</button>
        </div>
      </section>
    </div>
  )
}

export default LandingPage 