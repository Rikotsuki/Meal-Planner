import React, { useState } from 'react';
import { mealPlanAPI } from '../../services/api';
import './MealPlanGenerator.css';

const MealPlanGenerator = () => {
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
      // Extract meal names from recipes to save storage space
      const mealNames = generatedPlan.recipes.map(recipe => recipe.title || recipe.name || 'Unknown Meal');
      console.log("Extracted meal names:", mealNames);
      
      const mealPlanData = {
        name: `Meal Plan - ${new Date().toLocaleDateString()}`,
        description: `${preferences.diet} diet with ${preferences.calories} calories`,
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        preferences,
        mealNames: mealNames // Send meal names instead of full recipes
      };
      
      await mealPlanAPI.createMealPlan(mealPlanData);
      alert('Meal plan saved successfully!');
    } catch (error) {
      setError('Failed to save meal plan. Please try again.');
      console.error('Save meal plan error:', error);
    }
  };

  const { carbPercent, fatPercent, proteinPercent } = calculateMacros();

  return (
    <div className="meal-plan-generator">
      <div className="generator-container">
        <h2>Create Your Meal Plan</h2>
        <p className="generator-subtitle">
          Generate personalized meal plans based on your dietary preferences and nutritional goals.
        </p>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="generator-form">
          {/* Diet Selection */}
          <div className="form-section">
            <h3>Dietary Preferences</h3>
            <div className="diet-buttons">
              {diets.map(diet => (
                <button
                  key={diet}
                  className={`diet-btn ${preferences.diet === diet ? 'active' : ''}`}
                  onClick={() => handlePreferenceChange('diet', diet)}
                >
                  {diet}
                </button>
              ))}
            </div>
          </div>

          {/* Calorie and Meal Settings */}
          <div className="form-section">
            <h3>Daily Goals</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Daily Calories</label>
                <div className="input-group">
                  <input
                    type="number"
                    value={preferences.calories}
                    onChange={(e) => handlePreferenceChange('calories', e.target.value)}
                    className="calorie-input"
                  />
                  <span>calories</span>
                </div>
              </div>
              <div className="form-group">
                <label>Meals per Day</label>
                <div className="input-group">
                  <input
                    type="number"
                    value={preferences.meals}
                    onChange={(e) => handlePreferenceChange('meals', e.target.value)}
                    className="meal-input"
                    min="1"
                    max="6"
                  />
                  <span>meals</span>
                </div>
              </div>
            </div>
          </div>

          {/* Macro Settings */}
          <div className="form-section">
            <h3>Macro Targets (grams)</h3>
            <div className="macro-inputs">
              <div className="macro-input">
                <label>Carbs</label>
                <input
                  type="number"
                  value={preferences.carbs}
                  onChange={(e) => handlePreferenceChange('carbs', e.target.value)}
                />
                <span className="macro-percent">{carbPercent}%</span>
              </div>
              <div className="macro-input">
                <label>Fat</label>
                <input
                  type="number"
                  value={preferences.fat}
                  onChange={(e) => handlePreferenceChange('fat', e.target.value)}
                />
                <span className="macro-percent">{fatPercent}%</span>
              </div>
              <div className="macro-input">
                <label>Protein</label>
                <input
                  type="number"
                  value={preferences.protein}
                  onChange={(e) => handlePreferenceChange('protein', e.target.value)}
                />
                <span className="macro-percent">{proteinPercent}%</span>
              </div>
            </div>
          </div>

          <button 
            className="generate-btn" 
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? 'Generating...' : 'Generate Meal Plan'}
          </button>
        </div>

        {/* Generated Results */}
        {generatedPlan && (
          <div className="generated-results">
            <div className="results-header">
              <h3>Your Generated Meal Plan</h3>
              <button className="save-btn" onClick={handleSavePlan}>
                Save Plan
              </button>
            </div>
            
            <div className="nutrition-summary">
              <h4>Nutrition Summary</h4>
              <div className="nutrition-grid">
                <div className="nutrition-item">
                  <span className="nutrition-label">Calories</span>
                  <span className="nutrition-value">{generatedPlan.nutrition.calories}</span>
                </div>
                <div className="nutrition-item">
                  <span className="nutrition-label">Carbs</span>
                  <span className="nutrition-value">{generatedPlan.nutrition.carbs.grams}g ({generatedPlan.nutrition.carbs.percent}%)</span>
                </div>
                <div className="nutrition-item">
                  <span className="nutrition-label">Fat</span>
                  <span className="nutrition-value">{generatedPlan.nutrition.fat.grams}g ({generatedPlan.nutrition.fat.percent}%)</span>
                </div>
                <div className="nutrition-item">
                  <span className="nutrition-label">Protein</span>
                  <span className="nutrition-value">{generatedPlan.nutrition.protein.grams}g ({generatedPlan.nutrition.protein.percent}%)</span>
                </div>
              </div>
            </div>

            <div className="recipes-grid">
              <h4>Recommended Recipes</h4>
              <div className="recipes-container">
                {generatedPlan.recipes.slice(0, 12).map((recipe, index) => (
                  <div key={recipe.id} className="recipe-card">
                    <div className="recipe-image">
                      <img src={recipe.image} alt={recipe.title} />
                    </div>
                    <div className="recipe-info">
                      <h5>{recipe.title}</h5>
                      <p className="recipe-calories">{recipe.nutrition?.nutrients?.[0]?.amount || 0} calories</p>
                      <p className="recipe-time">{recipe.readyInMinutes || 'N/A'} minutes</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MealPlanGenerator; 