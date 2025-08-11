import React, { useState } from 'react';
import './AuthContainer.css';

const AuthContainer = ({ onAuthSuccess, onBackToLanding, isAuthenticated, user, onLogout }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (formType, field, value) => {
    if (formType === 'login') {
      setLoginData(prev => ({ ...prev, [field]: value }));
    } else {
      setSignupData(prev => ({ ...prev, [field]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (formType) => {
    const newErrors = {};
    const data = formType === 'login' ? loginData : signupData;

    if (formType === 'login') {
      if (!data.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(data.email)) {
        newErrors.email = 'Email is invalid';
      }

      if (!data.password) {
        newErrors.password = 'Password is required';
      }
    } else {
      if (!data.name.trim()) {
        newErrors.name = 'Name is required';
      } else if (data.name.length < 2) {
        newErrors.name = 'Name must be at least 2 characters';
      }

      if (!data.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(data.email)) {
        newErrors.email = 'Email is invalid';
      }

      if (!data.password) {
        newErrors.password = 'Password is required';
      } else if (data.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e, formType) => {
    e.preventDefault();
    
    if (!validateForm(formType)) return;

    setIsLoading(true);
    try {
      const endpoint = formType === 'login' ? 'login' : 'signup';
      const body = formType === 'login' ? loginData : signupData;

      const response = await fetch(`http://localhost:5000/api/auth/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `${formType === 'login' ? 'Login' : 'Signup'} failed`);
      }

      // Store tokens in localStorage
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));

      onAuthSuccess(data);
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsLogin(!isLogin);
      setErrors({});
      setIsAnimating(false);
    }, 600);
  };

  return (
    <div className="auth-page">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="logo">
            <h1 onClick={onBackToLanding} className="clickable-logo">Meal Planner</h1>
          </div>
          <nav className="nav">
            <a href="#how-it-works">How It Works</a>
            <a href="#supported-diets">Supported Diets</a>
            <a href="#for-professionals">For Professionals</a>
            {isAuthenticated ? (
              <div className="user-menu">
                <span className="user-greeting">Hello, {user?.name || 'User'}!</span>
                <button className="btn-secondary" onClick={onLogout}>Sign Out</button>
              </div>
            ) : null}
          </nav>
        </div>
      </header>

      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-content">
            {/* Login Form */}
            <div className={`form-container ${isLogin ? 'active' : ''}`}>
              <div className="form-header">
                <h2>Welcome Back</h2>
                <p>Sign in to your Meal Planner account</p>
              </div>

              {errors.general && (
                <div className="error-message">{errors.general}</div>
              )}

              <form onSubmit={(e) => handleSubmit(e, 'login')} className="auth-form">
                <div className="form-group">
                  <input
                    type="email"
                    placeholder="Email"
                    value={loginData.email}
                    onChange={(e) => handleInputChange('login', 'email', e.target.value)}
                    className={errors.email ? 'error' : ''}
                  />
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <input
                    type="password"
                    placeholder="Password"
                    value={loginData.password}
                    onChange={(e) => handleInputChange('login', 'password', e.target.value)}
                    className={errors.password ? 'error' : ''}
                  />
                  {errors.password && <span className="error-text">{errors.password}</span>}
                </div>

                <button type="submit" className="auth-button" disabled={isLoading}>
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </button>
              </form>
            </div>

            {/* Signup Form */}
            <div className={`form-container ${!isLogin ? 'active' : ''}`}>
              <div className="form-header">
                <h2>Create Account</h2>
                <p>Join Meal Planner and start your journey</p>
              </div>

              {errors.general && (
                <div className="error-message">{errors.general}</div>
              )}

              <form onSubmit={(e) => handleSubmit(e, 'signup')} className="auth-form">
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Name"
                    value={signupData.name}
                    onChange={(e) => handleInputChange('signup', 'name', e.target.value)}
                    className={errors.name ? 'error' : ''}
                  />
                  {errors.name && <span className="error-text">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <input
                    type="email"
                    placeholder="Email"
                    value={signupData.email}
                    onChange={(e) => handleInputChange('signup', 'email', e.target.value)}
                    className={errors.email ? 'error' : ''}
                  />
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <input
                    type="password"
                    placeholder="Password"
                    value={signupData.password}
                    onChange={(e) => handleInputChange('signup', 'password', e.target.value)}
                    className={errors.password ? 'error' : ''}
                  />
                  {errors.password && <span className="error-text">{errors.password}</span>}
                </div>

                <button type="submit" className="auth-button" disabled={isLoading}>
                  {isLoading ? 'Creating Account...' : 'Sign Up'}
                </button>
              </form>
            </div>

            {/* Switch Panel */}
            <div className={`switch-panel ${isLogin ? '' : 'switched'}`}>
              <div className="switch-content">
                <div className={`switch-text ${isLogin ? 'active' : ''}`}>
                  <h2>Hello, Friend!</h2>
                  <p>Enter your personal details and start journey with us</p>
                  <button onClick={toggleMode} className="switch-button">Sign Up</button>
                </div>
                <div className={`switch-text ${!isLogin ? 'active' : ''}`}>
                  <h2>Welcome Back</h2>
                  <p>To keep connected with us please login with your personal info</p>
                  <button onClick={toggleMode} className="switch-button">Sign In</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthContainer; 