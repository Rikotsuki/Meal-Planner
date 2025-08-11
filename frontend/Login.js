import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';

const LogIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email address is invalid';
    
    if (!formData.password) newErrors.password = 'Password is required';
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      
      // Simulate API call
      setTimeout(() => {
        // Check credentials against localStorage
        const storedUser = JSON.parse(localStorage.getItem('user'));
        
        if (storedUser && storedUser.email === formData.email) {
          navigate('/profile');
        } else {
          setLoginError('Invalid email or password');
        }
        
        setIsSubmitting(false);
      }, 1000);
    }
  };

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handleSubmit}>
        <h2 style={styles.title}>Login to Your Account</h2>
        
        {loginError && <div style={styles.loginError}>{loginError}</div>}
        
        <div style={styles.formGroup}>
          <label htmlFor="login-email" style={styles.label}>Email</label>
          <input
            type="email"
            id="login-email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
            placeholder="Enter email"
          />
          {errors.email && <span style={styles.error}>{errors.email}</span>}
        </div>
        
        <div style={styles.formGroup}>
          <label htmlFor="login-password" style={styles.label}>Password</label>
          <input
            type="password"
            id="login-password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
            placeholder="Enter password"
          />
          {errors.password && <span style={styles.error}>{errors.password}</span>}
        </div>
        
        <button 
          type="submit" 
          style={styles.button}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
        
        <div style={styles.switchLink}>
          Don't have an account? 
        </div>
      </form>
    </div>
  );
};


const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: '20px',
  },
  form: {
    width: '100%',
    maxWidth: '400px',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
  },
  profileCard: {
    width: '100%',
    maxWidth: '500px',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
    textAlign: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: '25px',
    color: '#333',
    fontWeight: '600',
  },
  formGroup: {
    marginBottom: '20px',
  },
  profileInfo: {
    textAlign: 'left',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    marginBottom: '30px',
    fontSize: '18px',
    lineHeight: '1.8',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '500',
    color: '#555',
  },
  input: {
    width: '100%',
    padding: '12px 15px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '16px',
    transition: 'border-color 0.3s',
    boxSizing: 'border-box',
  },
  inputFocus: {
    borderColor: '#4a90e2',
    outline: 'none',
    boxShadow: '0 0 0 2px rgba(74, 144, 226, 0.2)',
  },
  button: {
    width: '100%',
    padding: '12px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#4a90e2',
    color: 'white',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    marginTop: '10px',
  },
  buttonHover: {
    backgroundColor: '#3a7bc8',
  },
  buttonDisabled: {
    backgroundColor: '#a0c4ff',
    cursor: 'not-allowed',
  },
  error: {
    color: '#e74c3c',
    fontSize: '14px',
    marginTop: '5px',
    display: 'block',
  },
  loginError: {
    color: '#e74c3c',
    backgroundColor: '#fadbd8',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '20px',
    textAlign: 'center',
  },
  switchLink: {
    textAlign: 'center',
    marginTop: '20px',
    color: '#555',
  },
  link: {
    color: '#4a90e2',
    fontWeight: '600',
    textDecoration: 'none',
  },
};

// CSS for focus/hover states (add to your CSS file or use inline with Radium)
document.head.insertAdjacentHTML('beforeend', `
  <style>
    input:focus {
      border-color: #4a90e2 !important;
      outline: none;
      box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2) !important;
    }
    button:hover {
      background-color: #3a7bc8 !important;
    }
    button:disabled {
      background-color: #a0c4ff !important;
      cursor: not-allowed !important;
    }
  </style>
`);
export default LogIn;
