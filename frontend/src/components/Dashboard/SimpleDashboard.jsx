import React, { useState, useEffect, useMemo } from 'react';
import { mealPlanAPI, groceryListAPI, profileAPI } from '../../services/api';
import './BMICalculator.css';
import NutritionTracker from './NutritionTracker';
const join = (base, path) =>
  `${String(base).replace(/\/+$/,'')}/${String(path).replace(/^\/+/,'')}`;

const API_BASE = join(import.meta?.env?.VITE_BACKEND_URL || 'http://localhost:5000', '/api');

const SimpleDashboard = ({ user, onLogout }) => {
 

  const [activeTab, setActiveTab] = useState('generator');
  const [bmiLoading, setBmiLoading] = useState(false);
  const [bmiError, setBmiError] = useState('');
  
  const tabs = [
    { id: 'bmi',       label: 'BMI Calculator',            icon: '⚖️' },

    { id: 'generator', label: 'Meal Generator', icon: '🍽️' },
    { id: 'history', label: 'My Plans', icon: '📅' },
    { id: 'nutrition', label: 'Nutrition', icon: '📊' },
   

    { id: 'grocery', label: 'Grocery Lists', icon: '🛒' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ];

  // ---- BMI helpers (pure frontend) ----
  const BMI_DEFAULTS = { height: 170, weight: 70, age: 25, gender: 'male', activity: 'moderate', goal: 'maintain' };

  function calcBMI(weightKg, heightCm) {
    if (!weightKg || !heightCm) return null;
    const m = heightCm / 100;
    return +(weightKg / (m * m)).toFixed(2);
  }
  function calcBMR({ gender, weight, height, age }) {
    if (!weight || !height || !age) return null;
    return gender === 'male'
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;
  }
  function calcTDEE(bmr, activity) {
    if (!bmr) return null;
    const mult = { low: 1.2, moderate: 1.55, high: 1.9 };
    return Math.round(bmr * (mult[activity] || 1.55));
  }
  function calcTargetCalories(tdee, goal) {
    if (!tdee) return null;
    if (goal === 'lose') return tdee - 500;
    if (goal === 'gain') return tdee + 500;
    return tdee;
  }
  function bmiCategory(bmi) {
    if (typeof bmi !== 'number') return '';
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25)   return 'Normal';
    if (bmi < 30)   return 'Overweight';
    return 'Obese';
  }

// ---- BMI STARTS

const [bmiForm, setBmiForm] = useState(() => {
  try {
    return JSON.parse(localStorage.getItem('bmiForm')) || BMI_DEFAULTS;
  } catch { return BMI_DEFAULTS; }
});
const [bmiResult, setBmiResult] = useState(null);

const updateBmi = (k, v) =>
  setBmiForm(prev => {
    const next = { ...prev, [k]: v };
    // persist locally so it pre-fills next time
    try { localStorage.setItem('bmiForm', JSON.stringify(next)); } catch {}
    return next;
  });

  async function computeBMI(e) {
    e?.preventDefault?.();
    setBmiResult(null);
  
    try {
      const token = localStorage.getItem('token');
      const base = import.meta?.env?.VITE_BACKEND_URL || 'http://localhost:5000/api';
      const res = await fetch(`${base}/bmi`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          goal: bmiForm.goal,
          activityLevel: bmiForm.activity,
          height: Number(bmiForm.height),
          weight: Number(bmiForm.weight),
          age: Number(bmiForm.age),
          gender: bmiForm.gender
        })
      });
  
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
      const data = await res.json();
      const m = data.metrics || {};
      setBmiResult({
        bmi:   m.bmi ?? data.user?.bmi,
        bmr:   m.bmr,
        tdee:  m.tdee,
        daily: m.dailyCalories ?? data.user?.dailyCalories
      });
    } catch (err) {
      alert(err.message || 'BMI request failed');
    }
  }
  
  




const bmiCat = useMemo(() => bmiCategory(bmiResult?.bmi), [bmiResult]);
// BMI ENDS 

  const [preferences, setPreferences] = useState({
    diet: 'Eat Everything',
    calories: '2000',
    meals: '3',
    carbs: '250',
    fat: '67',
    protein: '150'
  });

  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [recipeDetails, setRecipeDetails] = useState(null);
  const [isLoadingRecipe, setIsLoadingRecipe] = useState(false);
  
  // Meal Plan History State
  const [mealPlans, setMealPlans] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [expandedPlans, setExpandedPlans] = useState(new Set());
  

  
  // Grocery Lists State
  const [groceryLists, setGroceryLists] = useState([]);
  const [isLoadingGrocery, setIsLoadingGrocery] = useState(false);
  const [selectedMealPlanForGrocery, setSelectedMealPlanForGrocery] = useState('');
  const [isGeneratingGrocery, setIsGeneratingGrocery] = useState(false);
  const [expandedGroceryLists, setExpandedGroceryLists] = useState(new Set());
  
  // User Profile State
  const [profile, setProfile] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    preferences: {
      diet: 'Eat Everything',
      calories: '2000',
      meals: '3',
      carbs: '250',
      fat: '67',
      protein: '150'
    }
  });

  const diets = [
    'Eat Everything',
    'Vegan',
    'Vegetarian',
    'Keto',
    'Paleo',
    'Mediterranean',
    'Halal',
    'Kosher'
  ];

  const handlePreferenceChange = (field, value) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateMacros = () => {
    const calories = parseInt(preferences.calories);
    const carbs = parseInt(preferences.carbs);
    const fat = parseInt(preferences.fat);
    const protein = parseInt(preferences.protein);
    
    const totalMacros = carbs + fat + protein;
    const carbPercent = Math.round((carbs / totalMacros) * 100);
    const fatPercent = Math.round((fat / totalMacros) * 100);
    const proteinPercent = Math.round((protein / totalMacros) * 100);
    
    return { carbPercent, fatPercent, proteinPercent };
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError('');
    
    try {
      const result = await mealPlanAPI.generateMealPlan(preferences);
      setGeneratedPlan(result);
    } catch (error) {
      setError('Failed to generate meal plan. Please try again.');
      console.error('Generate meal plan error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSavePlan = async () => {
    if (!generatedPlan) return;
    
    try {
      // Extract only meal names as text to save space
      const mealNames = generatedPlan.recipes.map(recipe => recipe.title);
      
      const mealPlanData = {
        name: `Meal Plan - ${new Date().toLocaleDateString()}`,
        description: `${preferences.diet} diet with ${preferences.calories} calories`,
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        preferences,
        mealNames: mealNames // Just store the names as text
      };
      
      console.log('Saving meal plan with data:', mealPlanData);
      console.log('Current token:', localStorage.getItem('token'));
      
      const response = await mealPlanAPI.createMealPlan(mealPlanData);
      console.log('Meal plan saved successfully:', response.data);
      alert('Meal plan saved successfully!');
    } catch (error) {
      console.error('Save meal plan error:', error);
      console.error('Error response:', error.response?.data);
      setError(`Failed to save meal plan: ${error.response?.data?.message || error.message}`);
    }
  };

  const { carbPercent, fatPercent, proteinPercent } = calculateMacros();

  // Load meal plan history when tab changes
  useEffect(() => {
    if (activeTab === 'history') {
      fetchMealPlans();
    }
  }, [activeTab]);



  // Load grocery lists when tab changes
  useEffect(() => {
    if (activeTab === 'grocery') {
      fetchGroceryLists();
    }
  }, [activeTab]);

  // Load profile when tab changes
  useEffect(() => {
    if (activeTab === 'profile') {
      fetchProfile();
    }
  }, [activeTab]);

  // Fetch meal plans
  const fetchMealPlans = async () => {
    try {
      setIsLoadingHistory(true);
      const response = await mealPlanAPI.getUserMealPlans();
      setMealPlans(response.data);
    } catch (error) {
      console.error('Fetch meal plans error:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  };



  // Fetch grocery lists
  const fetchGroceryLists = async () => {
    try {
      setIsLoadingGrocery(true);
      const response = await groceryListAPI.getUserGroceryLists();
      setGroceryLists(response.data);
    } catch (error) {
      console.error('Fetch grocery lists error:', error);
    } finally {
      setIsLoadingGrocery(false);
    }
  };

  // Fetch profile
  const fetchProfile = async () => {
    try {
      const response = await profileAPI.getProfile();
      setProfile(response.data);
      setProfileData({
        name: response.data.name || user?.name || '',
        email: response.data.email || user?.email || '',
        preferences: response.data.preferences || {
          diet: 'Eat Everything',
          calories: '2000',
          meals: '3',
          carbs: '250',
          fat: '67',
          protein: '150'
        }
      });
    } catch (error) {
      console.error('Fetch profile error:', error);
    }
  };

  // Handle nutrition input change


  // Handle profile input change
  const handleProfileChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setProfileData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // Save profile
  const handleSaveProfile = async () => {
    try {
      await profileAPI.updateProfile(profileData);
      await fetchProfile();
      setIsEditingProfile(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Update profile error:', error);
    }
  };

  // Delete meal plan
  const handleDeleteMealPlan = async (planId) => {
    if (!window.confirm('Are you sure you want to delete this meal plan?')) {
      return;
    }

    try {
      await mealPlanAPI.deleteMealPlan(planId);
      setMealPlans(prev => prev.filter(plan => plan._id !== planId));
      // Remove from expanded plans if it was expanded
      setExpandedPlans(prev => {
        const newSet = new Set(prev);
        newSet.delete(planId);
        return newSet;
      });
    } catch (error) {
      console.error('Delete meal plan error:', error);
    }
  };

  // Toggle meal plan view
  const handleToggleView = (planId) => {
    setExpandedPlans(prev => {
      const newSet = new Set(prev);
      if (newSet.has(planId)) {
        newSet.delete(planId);
      } else {
        newSet.add(planId);
      }
      return newSet;
    });
  };

  // Generate grocery list from meal plan
  const handleGenerateGroceryList = async () => {
    if (!selectedMealPlanForGrocery) {
      alert('Please select a meal plan first');
      return;
    }

    try {
      setIsGeneratingGrocery(true);
      const response = await groceryListAPI.createGroceryList(selectedMealPlanForGrocery);
      setGroceryLists(prev => [response.data, ...prev]);
      setSelectedMealPlanForGrocery('');
      alert('Grocery list generated successfully!');
    } catch (error) {
      console.error('Generate grocery list error:', error);
      alert('Failed to generate grocery list. Please try again.');
    } finally {
      setIsGeneratingGrocery(false);
    }
  };

  // Delete grocery list
  const handleDeleteGroceryList = async (listId) => {
    if (!window.confirm('Are you sure you want to delete this grocery list?')) {
      return;
    }

    try {
      await groceryListAPI.deleteGroceryList(listId);
      setGroceryLists(prev => prev.filter(list => list._id !== listId));
      // Remove from expanded lists if it was expanded
      setExpandedGroceryLists(prev => {
        const newSet = new Set(prev);
        newSet.delete(listId);
        return newSet;
      });
    } catch (error) {
      console.error('Delete grocery list error:', error);
      alert('Failed to delete grocery list');
    }
  };

  // Toggle grocery list view
  const handleToggleGroceryView = (listId) => {
    setExpandedGroceryLists(prev => {
      const newSet = new Set(prev);
      if (newSet.has(listId)) {
        newSet.delete(listId);
      } else {
        newSet.add(listId);
      }
      return newSet;
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Fetch recipe details
  const handleRecipeClick = async (recipe) => {
    setSelectedRecipe(recipe);
    setIsLoadingRecipe(true);
    
    try {
      // Always fetch fresh data from Spoonacular API
      const response = await mealPlanAPI.getRecipeInfo(recipe.id);
      setRecipeDetails(response.data);
    } catch (error) {
      console.error('Fetch recipe details error:', error);
    } finally {
      setIsLoadingRecipe(false);
    }
  };

  // Close recipe modal
  const closeRecipeModal = () => {
    setSelectedRecipe(null);
    setRecipeDetails(null);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'bmi': {
        return (
          <div className="bmi-calculator">
            <h6 className="bmi-header">Set your goal, track your progress, and watch yourself win!</h6>
      
            {/* Form */}
            <form onSubmit={computeBMI} className="bmi-form">
              <div className="bmi-form-section">
                <label className="bmi-form-group">
                  <span>Height (cm)</span>
                  <input type="number" value={bmiForm.height}
                    onChange={(e)=>updateBmi('height', e.target.value)} />
                </label>
                <label className="bmi-form-group">
                  <span>Weight (kg)</span>
                  <input type="number" value={bmiForm.weight}
                    onChange={(e)=>updateBmi('weight', e.target.value)} />
                </label>
                <label className="bmi-form-group">
                  <span>Age</span>
                  <input type="number" value={bmiForm.age}
                    onChange={(e)=>updateBmi('age', e.target.value)} />
                </label>
              </div>
              <div className="bmi-form-section">
                <label className="bmi-form-group">
                  <span>Gender</span>
                  <select value={bmiForm.gender} onChange={(e)=>updateBmi('gender', e.target.value)}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </label>
                <label className="bmi-form-group">
                  <span>Activity</span>
                  <select value={bmiForm.activity} onChange={(e)=>updateBmi('activity', e.target.value)}>
                    <option value="low">Low</option>
                    <option value="moderate">Moderate</option>
                    <option value="high">High</option>
                  </select>
                </label>
                <label className="bmi-form-group">
                  <span>Goal</span>
                  <select value={bmiForm.goal} onChange={(e)=>updateBmi('goal', e.target.value)}>
                    <option value="lose">Lose</option>
                    <option value="maintain">Maintain</option>
                    <option value="gain">Gain</option>
                  </select>
                </label>
              </div>
            </form>

{/* Calculate Button - now separate and bigger */}
<div style={{ marginTop: '1rem', textAlign: 'center', paddingBottom:'1rem' }}>
  <button 
    type="submit"
    onClick={computeBMI}
    className="bmi-calculate-btn"
  >
    Calculate
  </button>
</div>

      
            {/* Results */}
            {bmiResult && (
              <div className="bmi-results">
                {/* Cheerful message */}
                <div className="bmi-message">
      {bmiCat === 'Underweight' && "🌱 You're lighter than average — focus on healthy nourishment!"}
      {bmiCat === 'Normal' && "💪 You're right on track! Keep up the great balance."}
      {bmiCat === 'Overweight' && "🌟 Small steps lead to big changes — you've got this!"}
      {bmiCat === 'Obese' && "❤️ Your health matters — every day is a new chance to improve."}
    </div>

                {/* Results grid */}
                <div className="bmi-results-grid">
                  <div className="bmi-result-item">
                    <div className="bmi-result-label">BMI</div>
                    <div className="bmi-result-value">
                      {bmiResult.bmi ?? '—'}
                    </div>
                  </div>
                  <div className="bmi-result-item">
                    <div className="bmi-result-label">Category</div>
                    <div className="bmi-result-value">{bmiCat || '—'}</div>
                  </div>
                  <div className="bmi-result-item">
                    <div className="bmi-result-label">BMR</div>
                    <div className="bmi-result-value">{bmiResult.bmr ?? '—'}</div>
                  </div>
                  <div className="bmi-result-item">
                    <div className="bmi-result-label">TDEE</div>
                    <div className="bmi-result-value">{bmiResult.tdee ?? '—'}</div>
                  </div>
                  <div className="bmi-result-item">
                    <div className="bmi-result-label">Daily Calories</div>
                    <div className="bmi-result-value">
                      {bmiResult.daily ?? '—'}
                    </div>
                  </div>
    </div>
                <div className="bmi-note">
      * “Daily Calories” reflects your goal (−500 for lose, +500 for gain).
    </div>
  </div>
)}

          </div>
        );
      }
      

      case 'generator':
        return (
          <div style={{ color: 'white' }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Create Your Meal Plan</h3>
            
            {error && (
              <div style={{ 
                background: 'rgba(255, 107, 107, 0.2)', 
                border: '1px solid rgba(255, 107, 107, 0.5)', 
                color: '#ff6b6b', 
                padding: '1rem', 
                borderRadius: '8px', 
                marginBottom: '1.5rem' 
              }}>
                {error}
              </div>
            )}

            {/* Diet Selection */}
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ marginBottom: '1rem' }}>Dietary Preferences</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.75rem' }}>
                {diets.map(diet => (
                  <button
                    key={diet}
                    onClick={() => handlePreferenceChange('diet', diet)}
                    style={{
                      background: preferences.diet === diet ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.1)',
                      color: preferences.diet === diet ? '#333' : 'white',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: preferences.diet === diet ? '600' : '500'
                    }}
                  >
                    {diet}
                  </button>
                ))}
              </div>
            </div>

            {/* Calorie and Meal Settings */}
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ marginBottom: '1rem' }}>Daily Goals</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Daily Calories</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '8px', padding: '0.75rem' }}>
                    <input
                      type="number"
                      value={preferences.calories}
                      onChange={(e) => handlePreferenceChange('calories', e.target.value)}
                      style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1rem', width: '100%', outline: 'none' }}
                    />
                    <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: '500' }}>calories</span>
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Meals per Day</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '8px', padding: '0.75rem' }}>
                    <input
                      type="number"
                      value={preferences.meals}
                      onChange={(e) => handlePreferenceChange('meals', e.target.value)}
                      min="1"
                      max="6"
                      style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1rem', width: '100%', outline: 'none' }}
                    />
                    <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: '500' }}>meals</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Macro Settings */}
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ marginBottom: '1rem' }}>Macro Targets (grams)</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Carbs</label>
                  <input
                    type="number"
                    value={preferences.carbs}
                    onChange={(e) => handlePreferenceChange('carbs', e.target.value)}
                    style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '8px', padding: '0.75rem', color: 'white', fontSize: '1rem', width: '100%', outline: 'none' }}
                  />
                  <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem', fontWeight: '500' }}>{carbPercent}%</span>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Fat</label>
                  <input
                    type="number"
                    value={preferences.fat}
                    onChange={(e) => handlePreferenceChange('fat', e.target.value)}
                    style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '8px', padding: '0.75rem', color: 'white', fontSize: '1rem', width: '100%', outline: 'none' }}
                  />
                  <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem', fontWeight: '500' }}>{fatPercent}%</span>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Protein</label>
                  <input
                    type="number"
                    value={preferences.protein}
                    onChange={(e) => handlePreferenceChange('protein', e.target.value)}
                    style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '8px', padding: '0.75rem', color: 'white', fontSize: '1rem', width: '100%', outline: 'none' }}
                  />
                  <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem', fontWeight: '500' }}>{proteinPercent}%</span>
                </div>
              </div>
            </div>

            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                padding: '1rem 2rem',
                borderRadius: '12px',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: isGenerating ? 'not-allowed' : 'pointer',
                opacity: isGenerating ? 0.6 : 1,
                marginTop: '1rem'
              }}
            >
              {isGenerating ? 'Generating...' : 'Generate Meal Plan'}
            </button>

            {/* Generated Results */}
            {generatedPlan && (
              <div style={{ marginTop: '2rem', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '16px', padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>Your Generated Meal Plan</h3>
                  <button 
                    onClick={handleSavePlan}
                    style={{
                      background: 'rgba(76, 175, 80, 0.8)',
                      color: 'white',
                      border: 'none',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    Save Plan
                  </button>
                </div>
                
                <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem' }}>
                  <h4 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', fontWeight: '600' }}>Nutrition Summary</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px' }}>
                      <span style={{ fontWeight: '500', color: 'rgba(255, 255, 255, 0.8)' }}>Calories</span>
                      <span style={{ fontWeight: '600', color: 'white' }}>{generatedPlan.nutrition.calories}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px' }}>
                      <span style={{ fontWeight: '500', color: 'rgba(255, 255, 255, 0.8)' }}>Carbs</span>
                      <span style={{ fontWeight: '600', color: 'white' }}>{generatedPlan.nutrition.carbs.grams}g ({generatedPlan.nutrition.carbs.percent}%)</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px' }}>
                      <span style={{ fontWeight: '500', color: 'rgba(255, 255, 255, 0.8)' }}>Fat</span>
                      <span style={{ fontWeight: '600', color: 'white' }}>{generatedPlan.nutrition.fat.grams}g ({generatedPlan.nutrition.fat.percent}%)</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px' }}>
                      <span style={{ fontWeight: '500', color: 'rgba(255, 255, 255, 0.8)' }}>Protein</span>
                      <span style={{ fontWeight: '600', color: 'white' }}>{generatedPlan.nutrition.protein.grams}g ({generatedPlan.nutrition.protein.percent}%)</span>
                    </div>
                  </div>
                </div>

                                  <div>
                    <h4 style={{ margin: '0 0 1.5rem 0', fontSize: '1.2rem', fontWeight: '600' }}>Recommended Recipes</h4>
                    <p style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.8)', fontStyle: 'italic' }}>
                      💡 Click any recipe to view details. Only meal names will be saved to your plan to save database space.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {generatedPlan.recipes.slice(0, 12).map((recipe, index) => (
                      <div 
                        key={recipe.id} 
                        onClick={() => handleRecipeClick(recipe)}
                        style={{ 
                          background: 'rgba(255, 255, 255, 0.1)', 
                          borderRadius: '12px', 
                          overflow: 'hidden', 
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          cursor: 'pointer',
                          transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.transform = 'translateY(-5px)'}
                        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                      >
                        <div style={{ width: '100%', height: '180px', overflow: 'hidden' }}>
                          <img src={recipe.image} alt={recipe.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ padding: '1rem' }}>
                          <h5 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: '600', color: 'white', lineHeight: '1.3' }}>{recipe.title}</h5>
                          <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)' }}>{recipe.nutrition?.nutrients?.[0]?.amount || 0} calories</p>
                          <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)' }}>{recipe.readyInMinutes || 'N/A'} minutes</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case 'history':
        return (
          <div style={{ color: 'white' }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>My Meal Plans</h3>
            
            {isLoadingHistory ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ width: '40px', height: '40px', border: '4px solid rgba(255, 255, 255, 0.3)', borderTop: '4px solid white', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }}></div>
                <p>Loading your meal plans...</p>
              </div>
            ) : mealPlans.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📅</div>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', fontWeight: '600' }}>No meal plans yet</h3>
                <p style={{ margin: 0, fontSize: '1.1rem' }}>Create your first meal plan to get started!</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                {mealPlans.map((plan) => (
                  <div key={plan._id} style={{ background: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '1.5rem', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <h4 style={{ margin: 0, fontSize: '1.3rem', fontWeight: '600', color: 'white' }}>{plan.name}</h4>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          onClick={() => handleToggleView(plan._id)} 
                          style={{ 
                            padding: '0.5rem 1rem', 
                            border: 'none', 
                            borderRadius: '6px', 
                            cursor: 'pointer', 
                            fontWeight: '500', 
                            fontSize: '0.9rem', 
                            background: expandedPlans.has(plan._id) ? 'rgba(76, 175, 80, 1)' : 'rgba(76, 175, 80, 0.8)', 
                            color: 'white',
                            boxShadow: expandedPlans.has(plan._id) ? '0 0 0 2px rgba(76, 175, 80, 0.3)' : 'none'
                          }}
                        >
                          {expandedPlans.has(plan._id) ? 'Hide' : 'View'}
                        </button>
                        <button 
                          onClick={() => handleDeleteMealPlan(plan._id)} 
                          style={{ 
                            padding: '0.5rem 1rem', 
                            border: 'none', 
                            borderRadius: '6px', 
                            cursor: 'pointer', 
                            fontWeight: '500', 
                            fontSize: '0.9rem', 
                            background: 'rgba(244, 67, 54, 0.8)', 
                            color: 'white' 
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: '0 0 0.75rem 0', fontSize: '0.95rem' }}>{plan.description}</p>
                    
                    {/* Show saved meal names - only when expanded */}
                    {plan.mealNames && plan.mealNames.length > 0 && expandedPlans.has(plan._id) && (
                      <div style={{ marginBottom: '1rem' }}>
                        <h5 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: '600', color: 'white' }}>Saved Meals ({plan.mealNames.length})</h5>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          {plan.mealNames.map((mealName, index) => (
                            <div key={index} style={{ 
                              padding: '0.5rem', 
                              background: 'rgba(255, 255, 255, 0.05)', 
                              borderRadius: '6px',
                              fontSize: '0.9rem'
                            }}>
                              <div style={{ fontWeight: '500', color: 'white' }}>{mealName}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Show meal count when collapsed */}
                    {plan.mealNames && plan.mealNames.length > 0 && !expandedPlans.has(plan._id) && (
                      <div style={{ 
                        marginBottom: '1rem',
                        padding: '0.5rem 0.75rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '6px',
                        borderLeft: '3px solid rgba(76, 175, 80, 0.5)'
                      }}>
                        <span style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.8)', fontWeight: '500' }}>
                          {plan.mealNames.length} meals saved
                        </span>
                      </div>
                    )}
                    
                    <div style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                      <div>Created: {formatDate(plan.createdAt)}</div>
                      {plan.startDate && <div>Start: {formatDate(plan.startDate)}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 'nutrition':
        return <NutritionTracker />;
   

      case 'grocery':
        return (
          <div style={{ color: 'white' }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Grocery Lists</h3>
            
            {/* Generate New Grocery List Section */}
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.05)', 
              borderRadius: '12px', 
              padding: '1.5rem', 
              marginBottom: '2rem', 
              border: '1px solid rgba(255, 255, 255, 0.1)' 
            }}>
              <h4 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', fontWeight: '600' }}>Generate New Grocery List</h4>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <select
                  value={selectedMealPlanForGrocery}
                  onChange={(e) => setSelectedMealPlanForGrocery(e.target.value)}
                  style={{ 
                    flex: 1, 
                    minWidth: '250px',
                    padding: '0.75rem 1rem',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'black',
                    fontSize: '1rem'
                  }}
                >
                  <option value="">Select a meal plan...</option>
                  {mealPlans.map((plan) => (
                    <option key={plan._id} value={plan._id}>
                      {plan.name} ({plan.mealNames?.length || 0} meals)
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleGenerateGroceryList}
                  disabled={!selectedMealPlanForGrocery || isGeneratingGrocery}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: !selectedMealPlanForGrocery || isGeneratingGrocery ? 'rgba(255, 255, 255, 0.2)' : 'linear-gradient(135deg, #4CAF50, #45a049)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '1rem',
                    cursor: !selectedMealPlanForGrocery || isGeneratingGrocery ? 'not-allowed' : 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {isGeneratingGrocery ? 'Generating...' : 'Generate Grocery List'}
                </button>
              </div>
            </div>
            
            {isLoadingGrocery ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ width: '40px', height: '40px', border: '4px solid rgba(255, 255, 255, 0.3)', borderTop: '4px solid white', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }}></div>
                <p>Loading your grocery lists...</p>
              </div>
            ) : groceryLists.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', fontWeight: '600' }}>No grocery lists yet</h3>
                <p style={{ margin: 0, fontSize: '1.1rem' }}>Select a meal plan above to generate your first grocery list!</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                {groceryLists.map((list) => (
                  <div key={list._id} style={{ background: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '1.5rem', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div>
                        <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.3rem', fontWeight: '600', color: 'white' }}>{list.name || 'Grocery List'}</h4>
                        <span style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)' }}>{formatDate(list.createdAt)}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          onClick={() => handleToggleGroceryView(list._id)} 
                          style={{ 
                            padding: '0.5rem 1rem', 
                            border: 'none', 
                            borderRadius: '6px', 
                            cursor: 'pointer', 
                            fontWeight: '500', 
                            fontSize: '0.9rem', 
                            background: expandedGroceryLists.has(list._id) ? 'rgba(76, 175, 80, 1)' : 'rgba(76, 175, 80, 0.8)', 
                            color: 'white',
                            boxShadow: expandedGroceryLists.has(list._id) ? '0 0 0 2px rgba(76, 175, 80, 0.3)' : 'none'
                          }}
                        >
                          {expandedGroceryLists.has(list._id) ? 'Hide' : 'View'}
                        </button>
                        <button 
                          onClick={() => handleDeleteGroceryList(list._id)} 
                          style={{ 
                            padding: '0.5rem 1rem', 
                            border: 'none', 
                            borderRadius: '6px', 
                            cursor: 'pointer', 
                            fontWeight: '500', 
                            fontSize: '0.9rem', 
                            background: 'rgba(244, 67, 54, 0.8)', 
                            color: 'white' 
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    
                    {/* Show grocery items - only when expanded */}
                    {list.items && list.items.length > 0 && expandedGroceryLists.has(list._id) && (
                      <div style={{ marginBottom: '1rem' }}>
                        <h5 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: '600', color: 'white' }}>Items ({list.items.length})</h5>
                        {/* Group items by meal */}
                        {(() => {
                          const itemsByMeal = {};
                          list.items.forEach(item => {
                            if (!itemsByMeal[item.mealName]) {
                              itemsByMeal[item.mealName] = [];
                            }
                            itemsByMeal[item.mealName].push(item);
                          });
                          
                          return Object.entries(itemsByMeal).map(([mealName, items]) => (
                            <div key={mealName} style={{ 
                              marginBottom: '1.5rem',
                              padding: '1rem',
                              background: 'rgba(255, 255, 255, 0.03)',
                              borderRadius: '8px',
                              borderLeft: '4px solid #4CAF50'
                            }}>
                                                             <h6 style={{ 
                                 margin: '0 0 0.75rem 0', 
                                 fontSize: '1rem', 
                                 fontWeight: '600', 
                                 color: '#ffd700',
                                 textTransform: 'capitalize'
                               }}>
                                 {mealName}
                               </h6>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {items.map((item, index) => (
                                  <div key={index} style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center', 
                                    padding: '0.5rem', 
                                    background: 'rgba(255, 255, 255, 0.05)', 
                                    borderRadius: '6px' 
                                  }}>
                                    <span style={{ fontWeight: '500', color: 'white', flex: 1 }}>{item.name}</span>
                                    <span style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.8)', fontWeight: '500' }}>
                                      {item.amount} {item.unit}
                                    </span>
                                    <span style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.6)', fontStyle: 'italic', marginLeft: '0.5rem' }}>
                                      {item.aisle}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ));
                        })()}
                      </div>
                    )}
                    
                    {/* Show item count when collapsed */}
                    {list.items && list.items.length > 0 && !expandedGroceryLists.has(list._id) && (
                      <div style={{ 
                        padding: '0.5rem 0.75rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '6px',
                        borderLeft: '3px solid rgba(76, 175, 80, 0.5)'
                      }}>
                        <span style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.8)', fontWeight: '500' }}>
                          {list.items.length} items organized by meal
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 'profile':
        return (
          <div style={{ color: 'white' }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>User Profile</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* Profile Information */}
              <div style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px', padding: '1.5rem', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <h4 style={{ margin: '0 0 1.5rem 0', fontSize: '1.3rem', fontWeight: '600' }}>Personal Information</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Name</label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => handleProfileChange('name', e.target.value)}
                      disabled={!isEditingProfile}
                      style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '8px', padding: '0.75rem', color: 'white', fontSize: '1rem', width: '100%', outline: 'none', opacity: isEditingProfile ? 1 : 0.6 }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Email</label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleProfileChange('email', e.target.value)}
                      disabled={!isEditingProfile}
                      style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '8px', padding: '0.75rem', color: 'white', fontSize: '1rem', width: '100%', outline: 'none', opacity: isEditingProfile ? 1 : 0.6 }}
                    />
                  </div>
                </div>
              </div>

              {/* Dietary Preferences */}
              <div style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px', padding: '1.5rem', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <h4 style={{ margin: '0 0 1.5rem 0', fontSize: '1.3rem', fontWeight: '600' }}>Dietary Preferences</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Preferred Diet</label>
                      <select
                        value={profileData.preferences.diet}
                        onChange={(e) => handleProfileChange('preferences.diet', e.target.value)}
                        disabled={!isEditingProfile}
                        style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '8px', padding: '0.75rem', color: 'white', fontSize: '1rem', width: '100%', outline: 'none', opacity: isEditingProfile ? 1 : 0.6 }}
                      >
                        <option value="Eat Everything">Eat Everything</option>
                        <option value="Vegan">Vegan</option>
                        <option value="Vegetarian">Vegetarian</option>
                        <option value="Keto">Keto</option>
                        <option value="Paleo">Paleo</option>
                        <option value="Mediterranean">Mediterranean</option>
                        <option value="Halal">Halal</option>
                        <option value="Kosher">Kosher</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Daily Calories</label>
                      <input
                        type="number"
                        value={profileData.preferences.calories}
                        onChange={(e) => handleProfileChange('preferences.calories', e.target.value)}
                        disabled={!isEditingProfile}
                        style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '8px', padding: '0.75rem', color: 'white', fontSize: '1rem', width: '100%', outline: 'none', opacity: isEditingProfile ? 1 : 0.6 }}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Carbs (g)</label>
                      <input
                        type="number"
                        value={profileData.preferences.carbs}
                        onChange={(e) => handleProfileChange('preferences.carbs', e.target.value)}
                        disabled={!isEditingProfile}
                        style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '8px', padding: '0.75rem', color: 'white', fontSize: '1rem', width: '100%', outline: 'none', opacity: isEditingProfile ? 1 : 0.6 }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Fat (g)</label>
                      <input
                        type="number"
                        value={profileData.preferences.fat}
                        onChange={(e) => handleProfileChange('preferences.fat', e.target.value)}
                        disabled={!isEditingProfile}
                        style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '8px', padding: '0.75rem', color: 'white', fontSize: '1rem', width: '100%', outline: 'none', opacity: isEditingProfile ? 1 : 0.6 }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Protein (g)</label>
                      <input
                        type="number"
                        value={profileData.preferences.protein}
                        onChange={(e) => handleProfileChange('preferences.protein', e.target.value)}
                        disabled={!isEditingProfile}
                        style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '8px', padding: '0.75rem', color: 'white', fontSize: '1rem', width: '100%', outline: 'none', opacity: isEditingProfile ? 1 : 0.6 }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-start' }}>
                {isEditingProfile ? (
                  <>
                    <button 
                      onClick={handleSaveProfile}
                      style={{
                        background: 'rgba(76, 175, 80, 0.8)',
                        color: 'white',
                        border: 'none',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '1rem'
                      }}
                    >
                      Save Changes
                    </button>
                    <button 
                      onClick={() => setIsEditingProfile(false)}
                      style={{
                        background: 'rgba(158, 158, 158, 0.8)',
                        color: 'white',
                        border: 'none',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '1rem'
                      }}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => setIsEditingProfile(true)}
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '1rem'
                    }}
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      default:
        return <div>Welcome to Meal Planner!</div>;
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white'
    }}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      {/* Header */}
      <header style={{
        background: 'rgba(255, 255, 255, 0.95)',
        padding: '1rem 0',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0, color: '#333', fontSize: '1.8rem', fontWeight: '700' }}>Meal Planner</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ color: '#666', fontWeight: '500' }}>Welcome, {user?.name || 'User'}!</span>
            <button 
              onClick={onLogout}
              style={{
                background: '#ff4757',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav style={{
        background: 'rgba(255, 255, 255, 0.1)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: activeTab === tab.id ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
                border: 'none',
                padding: '1rem 1.5rem',
                color: activeTab === tab.id ? '#333' : 'rgba(255, 255, 255, 0.8)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                borderRadius: '8px 8px 0 0',
                fontWeight: activeTab === tab.id ? '600' : '500',
                whiteSpace: 'nowrap'
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>{tab.icon}</span>
              <span style={{ fontSize: '0.9rem' }}>{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '2rem 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '2rem',
            marginBottom: '2rem'
          }}>
            <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', fontWeight: '700' }}>
              {tabs.find(tab => tab.id === activeTab)?.label}
            </h2>
            <div style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '2rem', fontSize: '1.1rem' }}>
              {renderContent()}
            </div>
          </div>
        </div>
      </main>

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '2rem'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '16px',
            maxWidth: '800px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative',
            color: '#333'
          }}>
            {/* Close Button */}
            <button
              onClick={closeRecipeModal}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                cursor: 'pointer',
                fontSize: '1.2rem',
                zIndex: 1
              }}
            >
              ×
            </button>

            {isLoadingRecipe ? (
              <div style={{ padding: '3rem', textAlign: 'center' }}>
                <div style={{ width: '40px', height: '40px', border: '4px solid rgba(0, 0, 0, 0.1)', borderTop: '4px solid #333', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }}></div>
                <p>Loading recipe details...</p>
              </div>
            ) : recipeDetails ? (
              <div style={{ padding: '2rem' }}>
                {/* Recipe Header */}
                <div style={{ marginBottom: '2rem' }}>
                  <h2 style={{ margin: '0 0 1rem 0', fontSize: '2rem', fontWeight: '700', color: '#333' }}>
                    {recipeDetails.title}
                  </h2>
                  <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.2rem' }}>⏱️</span>
                      <span>{recipeDetails.readyInMinutes || 'N/A'} minutes</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.2rem' }}>👥</span>
                      <span>{recipeDetails.servings || 'N/A'} servings</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.2rem' }}>⭐</span>
                      <span>{recipeDetails.spoonacularScore || 'N/A'}/100</span>
                    </div>
                  </div>
                  {recipeDetails.image && (
                    <img 
                      src={recipeDetails.image} 
                      alt={recipeDetails.title}
                      style={{ 
                        width: '100%', 
                        height: '300px', 
                        objectFit: 'cover', 
                        borderRadius: '12px',
                        marginBottom: '1rem'
                      }} 
                    />
                  )}
                </div>

                {/* Recipe Summary */}
                {recipeDetails.summary && (
                  <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem', fontWeight: '600' }}>Summary</h3>
                    <div 
                      dangerouslySetInnerHTML={{ __html: recipeDetails.summary }}
                      style={{ 
                        lineHeight: '1.6',
                        color: '#666'
                      }}
                    />
                  </div>
                )}

                {/* Ingredients */}
                {recipeDetails.extendedIngredients && recipeDetails.extendedIngredients.length > 0 && (
                  <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem', fontWeight: '600' }}>Ingredients</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                      {recipeDetails.extendedIngredients.map((ingredient, index) => (
                        <div key={index} style={{ 
                          padding: '1rem', 
                          background: 'rgba(0, 0, 0, 0.05)', 
                          borderRadius: '8px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <span style={{ fontWeight: '500' }}>{ingredient.name}</span>
                          <span style={{ color: '#666', fontSize: '0.9rem' }}>
                            {ingredient.amount} {ingredient.unit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Instructions */}
                {recipeDetails.analyzedInstructions && recipeDetails.analyzedInstructions.length > 0 && (
                  <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem', fontWeight: '600' }}>Instructions</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {recipeDetails.analyzedInstructions[0].steps.map((step, index) => (
                        <div key={index} style={{ 
                          display: 'flex', 
                          gap: '1rem',
                          padding: '1rem',
                          background: 'rgba(0, 0, 0, 0.05)',
                          borderRadius: '8px'
                        }}>
                          <div style={{ 
                            background: '#667eea', 
                            color: 'white', 
                            borderRadius: '50%', 
                            width: '30px', 
                            height: '30px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            fontWeight: '600',
                            flexShrink: 0
                          }}>
                            {index + 1}
                          </div>
                          <div style={{ flex: 1 }}>
                            <p style={{ margin: 0, lineHeight: '1.6' }}>{step.step}</p>
                            {step.ingredients && step.ingredients.length > 0 && (
                              <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
                                <strong>Ingredients:</strong> {step.ingredients.map(i => i.name).join(', ')}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Nutrition Information */}
                {recipeDetails.nutrition && (
                  <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem', fontWeight: '600' }}>Nutrition Information</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                      {recipeDetails.nutrition.nutrients.map((nutrient, index) => (
                        <div key={index} style={{ 
                          padding: '1rem', 
                          background: 'rgba(0, 0, 0, 0.05)', 
                          borderRadius: '8px',
                          textAlign: 'center'
                        }}>
                          <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>{nutrient.name}</div>
                          <div style={{ color: '#666', marginTop: '0.25rem' }}>
                            {nutrient.amount} {nutrient.unit}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Source Link */}
                {recipeDetails.sourceUrl && (
                  <div style={{ textAlign: 'center', padding: '1rem', borderTop: '1px solid rgba(0, 0, 0, 0.1)' }}>
                    <a 
                      href={recipeDetails.sourceUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        textDecoration: 'none',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '8px',
                        fontWeight: '600',
                        display: 'inline-block'
                      }}
                    >
                      View Original Recipe
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ padding: '3rem', textAlign: 'center' }}>
                <p>Failed to load recipe details. Please try again.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleDashboard; 
