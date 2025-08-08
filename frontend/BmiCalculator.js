
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './UserDashboard.js';

const BmiCalculator = () => {
  const [height, setHeight] = useState(175);
  const [weight, setWeight] = useState(70);
  const [bmiValue, setBmiValue] = useState('22.9');
  const [bmiCategory, setBmiCategory] = useState('Normal Weight');
  const [recommendation, setRecommendation] = useState('Great job maintaining a healthy weight! Continue with balanced nutrition and regular physical activity.');
  const [scaleWidth, setScaleWidth] = useState(45);
  
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [selectedPreferences, setSelectedPreferences] = useState([]);

  const calculateBMI = () => {
    if (!height || !weight || height <= 0 || weight <= 0) {
      setBmiValue('--');
      setBmiCategory('Invalid Input');
      setRecommendation('Please enter valid height and weight values');
      setScaleWidth(0);
      return;
    }

    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    const roundedBMI = bmi.toFixed(1);
    
    setBmiValue(roundedBMI);
    
    let category, recText;
    let newScaleWidth = 0;
    
    if (bmi < 18.5) {
      category = 'Underweight';
      recText = 'Consider consulting a nutritionist to develop a healthy weight gain plan. Focus on nutrient-dense foods.';
      newScaleWidth = 15;
    } else if (bmi < 25) {
      category = 'Normal Weight';
      recText = 'Great job maintaining a healthy weight! Continue with balanced nutrition and regular physical activity.';
      newScaleWidth = 45;
    } else if (bmi < 30) {
      category = 'Overweight';
      recText = 'Focus on a balanced diet and regular exercise. Small, sustainable changes can lead to significant health improvements.';
      newScaleWidth = 75;
    } else {
      category = 'Obesity';
      recText = 'Consult with a healthcare provider for a personalized plan. Focus on gradual weight loss through diet and exercise.';
      newScaleWidth = 95;
    }
    
    setBmiCategory(category);
    setRecommendation(recText);
    setScaleWidth(newScaleWidth);
  };

  const handleGoalSelect = (goal) => {
    setSelectedGoal(goal);
  };

  const togglePreference = (preference) => {
    if (selectedPreferences.includes(preference)) {
      setSelectedPreferences(selectedPreferences.filter(p => p !== preference));
    } else {
      setSelectedPreferences([...selectedPreferences, preference]);
    }
  };

  const handleGenerateMeal = () => {
    if (!selectedGoal) {
      alert('Please select a goal');
      return;
    }
    
    if (selectedPreferences.length === 0) {
      alert('Please select at least one dietary preference');
      return;
    }
    
    const goalNames = {
      'lose': 'Lose Weight',
      'maintain': 'Maintain Weight',
      'gain': 'Gain Weight'
    };
    
    const preferenceNames = {
      'vegetarian': 'Vegetarian',
      'vegan': 'Vegan',
      'gluten-free': 'Gluten-Free',
      'dairy-free': 'Dairy-Free'
    };
    
    alert('Your personalized meal plan is being generated based on:\n\n' +
          `Goal: ${goalNames[selectedGoal]}\n` +
          `Preferences: ${selectedPreferences.map(p => preferenceNames[p]).join(', ')}`);
  };

  useEffect(() => {
    calculateBMI();
  });

  return (
    <div className="bmi-calculator">
      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        body {
          background: #f8fafc;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          color: #334155;
        }
        
        /* Navigation Bar */
        header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.2rem 5%;
          background: white;
          box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        
        .logo {
          font-size: 1.8rem;
          font-weight: bold;
          color: #4ade80;
          display: left;
          align-items: center;
        }
        
        .logo i {
          font-size: 2rem;
        }
        
        nav {
          display: flex;
          gap: 2rem;
          align-items: center;
        }
        
        nav a {
          text-decoration: none;
          color: #475569;
          transition: color 0.3s;
          position: relative;
        }
        
        nav a:hover {
          color: #4ade80;
        }
        
        .signup-btn {
          background: #4ade80;
          color: white;
          padding: 0.6rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 500;
          transition: all 0.3s;
          box-shadow: 0 4px 10px rgba(74, 222, 128, 0.3);
        }
        
        .signup-btn:hover {
          background: #22c55e;
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(74, 222, 128, 0.4);
        }
        
        .signin-text {
          font-size: 0.9rem;
          color: #64748b;
        }
        
        /* Main Content */
        .main-container {
          max-width: 1200px;
          width: 95%;
          margin: 2rem auto;
          flex: 1;
          padding: 0 20px;
        }
        
        .page-title {
          text-align: center;
          margin-bottom: 2.5rem;
        }
        
        .page-title h1 {
          font-size: 2.5rem;
          color: #1e293b;
          margin-bottom: 0.5rem;
          background: linear-gradient(90deg, #4ade80, #22d3ee);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .page-title p {
          font-size: 1.1rem;
          color: #64748b;
          max-width: 700px;
          margin: 0 auto;
          line-height: 1.6;
        }
        
        /* BMI Calculator */
        .bmi-container {
          display: flex;
          flex-wrap: wrap;
          margin-bottom: 3rem;
          border-radius: 25px;
          overflow: hidden;
          box-shadow: 0 15px 50px rgba(0, 0, 0, 0.1);
        }
        
        .left-panel {
          flex: 1;
          min-width: 300px;
          padding: 50px 40px;
          background: linear-gradient(160deg, #4ade80 0%, #22d3ee 100%);
          color: white;
          position: relative;
          overflow: hidden;
        }
        
        .right-panel {
          flex: 1.2;
          min-width: 300px;
          padding: 50px 40px;
          background: white;
        }
        
        .bmi-title {
          font-size: 36px;
          margin-bottom: 20px;
          position: relative;
          z-index: 2;
        }
        
        .bmi-subtitle {
          font-size: 18px;
          margin-bottom: 40px;
          opacity: 0.9;
          line-height: 1.6;
          position: relative;
          z-index: 2;
        }
        
        .illustration {
          text-align: center;
          margin: 40px 0;
          position: relative;
          z-index: 2;
        }
        
        .scale-container {
          position: relative;
          height: 25px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50px;
          overflow: hidden;
          margin: 30px 0;
          position: relative;
          z-index: 2;
        }
        
        .scale-fill {
          position: absolute;
          height: 100%;
          border-radius: 50px;
          transition: width 1.5s ease-in-out;
          background: linear-gradient(90deg, #2ecc71, #f1c40f, #e74c3c);
        }
        
        .scale-labels {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          margin-top: 10px;
          position: relative;
          z-index: 2;
        }
        
        .bmi-categories {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          margin-top: 30px;
          position: relative;
          z-index: 2;
        }
        
        .category {
          background: rgba(255, 255, 255, 0.15);
          padding: 15px;
          border-radius: 12px;
          font-size: 14px;
          backdrop-filter: blur(5px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .category i {
          margin-right: 10px;
          font-size: 18px;
        }
        
        .input-group {
          margin-bottom: 30px;
        }
        
        .input-label {
          display: block;
          margin-bottom: 12px;
          color: #2c3e50;
          font-weight: 600;
          font-size: 18px;
          display: flex;
          align-items: center;
        }
        
        .input-label i {
          margin-right: 10px;
          color: #4ade80;
        }
        
        .input-with-unit {
          display: flex;
          align-items: center;
          border: 2px solid #e2e8f0;
          border-radius: 15px;
          padding: 5px 20px;
          transition: all 0.3s;
        }
        
        .input-with-unit:focus-within {
          border-color: #4ade80;
          box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.2);
        }
        
        input {
          flex: 1;
          border: none;
          outline: none;
          padding: 16px 0;
          font-size: 18px;
          color: #2c3e50;
          font-weight: 500;
        }
        
        .unit {
          color: #7f8c8d;
          font-size: 18px;
          min-width: 40px;
          text-align: right;
        }
        
        .btn {
          width: 100%;
          padding: 18px;
          background: #4ade80;
          color: white;
          border: none;
          border-radius: 15px;
          font-size: 20px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin: 10px 0 30px;
          box-shadow: 0 10px 20px rgba(74, 222, 128, 0.3);
        }
        
        .btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 25px rgba(74, 222, 128, 0.4);
        }
        
        .btn:active {
          transform: translateY(1px);
        }
        
        .result-container {
          background: #f8f9ff;
          border-radius: 20px;
          padding: 30px;
          text-align: center;
          margin-top: 20px;
          border: 1px solid #eaefff;
        }
        
        .result-title {
          color: #4ade80;
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 20px;
        }
        
        .bmi-value {
          font-size: 72px;
          font-weight: 800;
          color: #4ade80;
          margin: 10px 0;
          line-height: 1;
        }
        
        .bmi-category {
          font-size: 28px;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 20px;
        }
        
        .recommendation {
          color: #7f8c8d;
          font-size: 17px;
          line-height: 1.6;
          margin-top: 20px;
          padding: 15px;
          background: white;
          border-radius: 15px;
          border: 1px solid #f0f0f0;
        }
        
        .decoration {
          position: absolute;
          border-radius: 50%;
          z-index: 1;
        }
        
        .dec-1 {
          width: 250px;
          height: 250px;
          background: rgba(255, 255, 255, 0.08);
          top: -100px;
          right: -100px;
        }
        
        .dec-2 {
          width: 180px;
          height: 180px;
          background: rgba(255, 255, 255, 0.1);
          bottom: -70px;
          left: -70px;
        }
        
        .dec-3 {
          width: 100px;
          height: 100px;
          background: rgba(255, 255, 255, 0.15);
          top: 40%;
          left: 50px;
        }
        
        /* Preferences Section */
        .preferences-section {
          background: white;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          padding: 2.5rem;
          margin-bottom: 3rem;
        }
        
        .section-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }
        
        .section-header h2 {
          font-size: 2rem;
          color: #1e293b;
          margin-bottom: 1rem;
          background: linear-gradient(90deg, #4ade80, #22d3ee);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .section-header p {
          font-size: 1.1rem;
          color: #64748b;
          max-width: 700px;
          margin: 0 auto;
          line-height: 1.6;
        }
        
        .preferences-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }
        
        .preference-group {
          background: #f8fafc;
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }
        
        .preference-group:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        
        .preference-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        
        .preference-header i {
          font-size: 1.8rem;
          color: #4ade80;
          background: rgba(74, 222, 128, 0.1);
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .preference-header h3 {
          font-size: 1.5rem;
          color: #1e293b;
        }
        
        .options-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.2rem;
        }
        
        .option-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.2rem;
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 15px;
          cursor: pointer;
          transition: all 0.3s;
        }
        
        .option-card:hover {
          border-color: #4ade80;
          box-shadow: 0 5px 15px rgba(74, 222, 128, 0.15);
        }
        
        .option-card.selected {
          background: #f0fdf4;
          border-color: #4ade80;
          box-shadow: 0 5px 15px rgba(74, 222, 128, 0.15);
        }
        
        .option-icon {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: rgba(74, 222, 128, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        
        .option-icon i {
          font-size: 1.5rem;
          color: #4ade80;
        }
        
        .option-content h4 {
          font-size: 1.2rem;
          color: #1e293b;
          margin-bottom: 0.3rem;
        }
        
        .option-content p {
          color: #64748b;
          font-size: 0.95rem;
          line-height: 1.5;
        }
        
        .generate-btn {
          display: block;
          width: 300px;
          margin: 2.5rem auto 0;
          padding: 1.1rem;
          background: #4ade80;
          color: white;
          border: none;
          border-radius: 15px;
          font-size: 1.2rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 6px 15px rgba(74, 222, 128, 0.3);
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.8rem;
        }
        
        .generate-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(74, 222, 128, 0.4);
          background: #22c55e;
        }
        
        footer {
          background: white;
          padding: 2rem;
          text-align: center;
          color: #64748b;
          border-top: 1px solid #e2e8f0;
          margin-top: 3rem;
        }
        
        .profile {
          display: flex;
          align-items: center;
          gap: 1rem;
          cursor: pointer;
          position: relative;
        }
        
        .profile-pic {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          background: linear-gradient(135deg, #4ade80, #22d3ee);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }
        
        .profile-info {
          text-align: right;
        }
        
        .profile-name {
          color: #1e293b;
        }
        
        .profile-role {
          color: #64748b;
        }
        
        @media (max-width: 900px) {
          .preferences-grid {
            grid-template-columns: 1fr;
          }
          
          .bmi-container {
            flex-direction: column;
          }
          
          .bmi-value {
            font-size: 60px;
          }
          
          nav {
            gap: 1rem;
          }
        }
        
        @media (max-width: 768px) {
          header {
            flex-direction: column;
            gap: 1.2rem;
            padding: 1.2rem;
          }
          
          nav {
            flex-wrap: wrap;
            justify-content: center;
          }
          
          .generate-btn {
            width: 100%;
          }
        }
        
        @media (max-width: 480px) {
          .bmi-title {
            font-size: 28px;
          }
          
          .bmi-subtitle {
            font-size: 16px;
          }
          
          .page-title h1 {
            font-size: 2rem;
          }
          
          .section-header h2 {
            font-size: 1.8rem;
          }
        }
      `}</style>
      
      {/* Navigation Bar */}
      <header>
        <div className="logo">
          <span>MealPlanner</span>
        </div>
        <nav>
          <a href="index.html">Home</a>
          <a href="mealplan">Meal Plan</a>
          <a href="bmi.html" className="active">BMI Calculator</a>
          <a href="recipe.html">Recipes</a>
          <div className="profile">
            <div className="profile-pic">K</div> 
            <div className="profile-info">
              <div className="profile-name"><Link to="/UserDashboard">Kay</Link></div>
            </div>
          </div>
        </nav>
      </header>
      
      {/* Main Content */}
      <div className="main-container">
        <div className="page-title">
          <h1>Personalized Nutrition Assistant</h1>
          <p>Calculate your BMI and customize your meal preferences for personalized recommendations</p>
        </div>
        
        {/* BMI Calculator */}
        <div className="bmi-container">
          <div className="left-panel">
            <div className="decoration dec-1"></div>
            <div className="decoration dec-2"></div>
            <div className="decoration dec-3"></div>
            
            <h1 className="bmi-title">BMI Calculator</h1>
            <p className="bmi-subtitle">Calculate your Body Mass Index to understand your weight category</p>
            
            <div className="illustration">
              <i className="fas fa-weight-scale" style={{ fontSize: '80px', opacity: '0.8' }}></i>
            </div>
            
            <div className="scale-container">
              <div className="scale-fill" id="bmiScale" style={{ width: `${scaleWidth}%` }}></div>
            </div>
            
            <div className="scale-labels">
              <span>Underweight</span>
              <span>Normal</span>
              <span>Overweight</span>
              <span>Obesity</span>
            </div>
            
            <div className="bmi-categories">
              <div className="category">
                <i className="fas fa-utensils"></i> Underweight: &lt; 18.5
              </div>
              <div className="category">
                <i className="fas fa-heart"></i> Normal: 18.5 - 24.9
              </div>
              <div className="category">
                <i className="fas fa-warning"></i> Overweight: 25 - 29.9
              </div>
              <div className="category">
                <i className="fas fa-exclamation-triangle"></i> Obesity: ≥ 30
              </div>
            </div>
          </div>
          
          <div className="right-panel">
            <div className="input-group">
              <label htmlFor="height"><i className="fas fa-ruler-vertical"></i> Height</label>
              <div className="input-with-unit">
                <input 
                  type="number" 
                  id="height" 
                  placeholder="Enter your height" 
                  min="1" 
                  value={height}
                  onChange={(e) => setHeight(parseFloat(e.target.value)) || ''}
                />
                <div className="unit">cm</div>
              </div>
            </div>
            
            <div className="input-group">
              <label htmlFor="weight"><i className="fas fa-weight-scale"></i> Weight</label>
              <div className="input-with-unit">
                <input 
                  type="number" 
                  id="weight" 
                  placeholder="Enter your weight" 
                  min="1" 
                  value={weight}
                  onChange={(e) => setWeight(parseFloat(e.target.value)) || ''}
                />
                <div className="unit">kg</div>
              </div>
            </div>
            
            <button className="btn" onClick={calculateBMI}>
              <i className="fas fa-calculator"></i> Calculate BMI
            </button>
            
            <div className="result-container">
              <div className="result-title">Your BMI Result</div>
              <div className="bmi-value">{bmiValue}</div>
              <div className="bmi-category">{bmiCategory}</div>
              <div className="recommendation">{recommendation}</div>
            </div>
          </div>
        </div>
        
        {/* Preferences Section */}
        <div className="preferences-section">
          <div className="section-header">
            <h2>Customize Your Meal Preferences</h2>
            <p>Select your goals and dietary preferences to receive personalized meal recommendations</p>
          </div>
          
          <div className="preferences-grid">
            {/* Goal Preferences */}
            <div className="preference-group">
              <div className="preference-header">
                <i className="fas fa-bullseye"></i>
                <h3>Choose Your Goal</h3>
              </div>
              
              <div className="options-grid">
                <div 
                  className={`option-card ${selectedGoal === 'lose' ? 'selected' : ''}`} 
                  onClick={() => handleGoalSelect('lose')}
                >
                  <div className="option-icon">
                    <i className="fas fa-weight-scale"></i>
                  </div>
                  <div className="option-content">
                    <h4>Lose Weight</h4>
                    <p>Calorie deficit meals to help you shed pounds</p>
                  </div>
                </div>
                
                <div 
                  className={`option-card ${selectedGoal === 'maintain' ? 'selected' : ''}`} 
                  onClick={() => handleGoalSelect('maintain')}
                >
                  <div className="option-icon">
                    <i className="fas fa-balance-scale"></i>
                  </div>
                  <div className="option-content">
                    <h4>Maintain Weight</h4>
                    <p>Balanced meals to keep your current weight</p>
                  </div>
                </div>
                
                <div 
                  className={`option-card ${selectedGoal === 'gain' ? 'selected' : ''}`} 
                  onClick={() => handleGoalSelect('gain')}
                >
                  <div className="option-icon">
                    <i className="fas fa-dumbbell"></i>
                  </div>
                  <div className="option-content">
                    <h4>Gain Weight</h4>
                    <p>Calorie-rich meals for muscle building</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Dietary Preferences */}
            <div className="preference-group">
              <div className="preference-header">
                <i className="fas fa-utensils"></i>
                <h3>Dietary Preferences</h3>
              </div>
              
              <div className="options-grid">
                <div 
                  className={`option-card ${selectedPreferences.includes('vegetarian') ? 'selected' : ''}`}
                  onClick={() => togglePreference('vegetarian')}
                >
                  <div className="option-icon">
                    <i className="fas fa-carrot"></i>
                  </div>
                  <div className="option-content">
                    <h4>Vegetarian</h4>
                    <p>Plant-based meals without meat</p>
                  </div>
                </div>
                
                <div 
                  className={`option-card ${selectedPreferences.includes('vegan') ? 'selected' : ''}`}
                  onClick={() => togglePreference('vegan')}
                >
                  <div className="option-icon">
                    <i className="fas fa-leaf"></i>
                  </div>
                  <div className="option-content">
                    <h4>Vegan</h4>
                    <p>No animal products at all</p>
                  </div>
                </div>
                
                <div 
                  className={`option-card ${selectedPreferences.includes('gluten-free') ? 'selected' : ''}`}
                  onClick={() => togglePreference('gluten-free')}
                >
                  <div className="option-icon">
                    <i className="fas fa-bread-slice"></i>
                  </div>
                  <div className="option-content">
                    <h4>Gluten-Free</h4>
                    <p>No gluten-containing ingredients</p>
                  </div>
                </div>
                
                <div 
                  className={`option-card ${selectedPreferences.includes('dairy-free') ? 'selected' : ''}`}
                  onClick={() => togglePreference('dairy-free')}
                >
                  <div className="option-icon">
                    <i className="fas fa-cheese"></i>
                  </div>
                  <div className="option-content">
                    <h4>Dairy-Free</h4>
                    <p>No milk or dairy products</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <button className="generate-btn" onClick={handleGenerateMeal}>
            <i className="fas fa-utensils"></i> Generate My Meal Plan
          </button>
        </div>
      </div>
      
      {/* Footer */}
      <footer id="footer" className="bg-green-700 text-white py-10 px-8">
        <div className="flex flex-col md:flex-row justify-between max-w-6xl mx-auto">
          <div>
            <h4 className="font-bold text-lg mb-3">MealPlanner</h4>
            <p className="text-sm">Eat better. Live better.</p>
          </div>
          <div className="space-y-2 mt-6 md:mt-0">
            <a href="t" className="block text-sm hover:underline">Privacy Policy</a>
            <a href="g" className="block text-sm hover:underline">Terms of Use</a>
            <a href="h" className="block text-sm hover:underline">Support</a>
          </div>
        </div>
        <p className="text-center text-sm mt-6">&copy; 2025 Meal Planner. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default BmiCalculator;
