import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
import './SignUp.js';
import './LogIn.js';
import './BmiCalculator.js';
import './UserDashboard.js';
import './Recipes.js';

// Remove this import: import foodImage from './images/food.jpg'; 

function HomePage() {
  return (
    <div className="app-container">
      {/* Navbar */}
      <header className="header">
        <h1 className="logo">MealPlanner</h1>
        <nav>
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/BmiCalculator">BMI Calculator</Link></li>
            <li><Link to="/UserDashboard">Meal Plan</Link></li>
            <li><Link to="/Recipes">Recipes</Link></li>
            <li><Link to="/SignUp" className="signup-btn">Sign Up</Link></li>
            <li><Link to="/LogIn">Already a member? Sign In</Link></li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h2>Plan Your Perfect Meals Automatically</h2>
          <p>
            Get a personalized meal plan tailored to your goals, calories, and diet. 
            Whether you're gaining muscle, losing fat, or just eating clean — we've got you.
          </p>
          <Link to="/meal-plan" className="cta-button">Start Planning Now</Link>
        </div>
        <div className="hero-image">          
          {/* Use image from public folder */}
          <img src="/images/food.jpg" alt="Healthy food" />
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h3>Why Choose SmartMeal?</h3>
        <div className="features-grid">
          <div className="feature-card">
            <img src="https://img.icons8.com/ios-filled/100/vegetarian-food.png" alt="Vegetarian Food Icon" />
            <h4>Custom Diets</h4>
            <p>Choose from keto, vegan, paleo, or your own macros. Meals adapt to your preferences.</p>
          </div>
          <div className="feature-card">
            <img src="https://img.icons8.com/ios-filled/100/time--v1.png" alt="Time Icon" />
            <h4>Auto Meal Scheduling</h4>
            <p>Generate weekly plans instantly and never waste time deciding what to eat.</p>
          </div>
          <div className="feature-card">
            {/* Use same image as hero or different path */}
            <img src="/images/meal-preview.jpg" alt="Meal Preview" />
            <h4>Calorie Accuracy</h4>
            <p>Set your goal calories and we'll balance your nutrients with tasty options.</p>
          </div>
        </div>
      </section>

      {/* Sample Meal Plan */}
      <section className="sample-meal">
        <h3>Sample Meal Plan</h3>
        <div className="meal-card">
          <h4>Wednesday Plan – 2,000 Calories</h4>
          <ul className="meal-list">
            <li><strong>Breakfast:</strong> Greek Yogurt with Berries & Honey</li>
            <li><strong>Lunch:</strong> Grilled Chicken Salad with Avocado</li>
            <li><strong>Dinner:</strong> Salmon with Quinoa & Broccoli</li>
            <li><strong>Snacks:</strong> Almonds, Protein Bar, Banana</li>
          </ul>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h4>SmartMeal</h4>
            <p>Eat better. Live better.</p>
          </div>
          <div className="footer-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Use</Link>
            <Link to="/support">Support</Link>
          </div>
        </div>
        <p className="copyright">&copy; 2025 SmartMeal Planner. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default HomePage;
