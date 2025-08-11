import React, { useState, useEffect } from 'react';
import { mealPlanAPI } from '../../services/api';
import './MealPlanHistory.css';

const MealPlanHistory = () => {
  const [mealPlans, setMealPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedPlans, setExpandedPlans] = useState(new Set());

  useEffect(() => {
    fetchMealPlans();
  }, []);

  const fetchMealPlans = async () => {
    try {
      setIsLoading(true);
      const response = await mealPlanAPI.getUserMealPlans();
      console.log("Fetched meal plans:", response.data);
      setMealPlans(response.data);
    } catch (error) {
      setError('Failed to load meal plans');
      console.error('Fetch meal plans error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePlan = async (planId) => {
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
      setError('Failed to delete meal plan');
      console.error('Delete meal plan error:', error);
    }
  };

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="meal-plan-history">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading your meal plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="meal-plan-history">
      <div className="history-container">
        <h2>My Meal Plans</h2>
        <p className="history-subtitle">
          View and manage your saved meal plans
        </p>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {mealPlans.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📅</div>
            <h3>No meal plans yet</h3>
            <p>Create your first meal plan to get started!</p>
          </div>
        ) : (
          <div className="meal-plans-grid">
            {mealPlans.map((plan) => (
              <div key={plan._id} className="meal-plan-card">
                <div className="plan-header">
                  <h3>{plan.name}</h3>
                  <div className="plan-actions">
                    <button 
                      className={`action-btn view-btn ${expandedPlans.has(plan._id) ? 'active' : ''}`}
                      onClick={() => handleToggleView(plan._id)}
                      title={expandedPlans.has(plan._id) ? 'Hide meals' : 'View meals'}
                    >
                      {expandedPlans.has(plan._id) ? 'Hide' : 'View'}
                    </button>
                    <button 
                      className="action-btn delete-btn"
                      onClick={() => handleDeletePlan(plan._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                
                <div className="plan-details">
                  <p className="plan-description">{plan.description}</p>
                  <div className="plan-dates">
                    <span>Created: {formatDate(plan.createdAt)}</span>
                    {plan.startDate && (
                      <span>Start: {formatDate(plan.startDate)}</span>
                    )}
                  </div>
                  
                  {/* Display saved meal names - only when expanded */}
                  {plan.mealNames && plan.mealNames.length > 0 && expandedPlans.has(plan._id) && (
                    <div className="saved-meals">
                      <h4>Saved Meals ({plan.mealNames.length})</h4>
                      <div className="meals-list">
                        {plan.mealNames.map((mealName, index) => (
                          <div key={index} className="meal-name">
                            {mealName}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Show meal count when collapsed */}
                  {plan.mealNames && plan.mealNames.length > 0 && !expandedPlans.has(plan._id) && (
                    <div className="meals-count">
                      <span>{plan.mealNames.length} meals saved</span>
                    </div>
                  )}
                </div>

                {plan.preferences && (
                  <div className="plan-preferences">
                    <h4>Preferences</h4>
                    <div className="preferences-grid">
                      <div className="preference-item">
                        <span className="preference-label">Diet:</span>
                        <span className="preference-value">{plan.preferences.diet}</span>
                      </div>
                      <div className="preference-item">
                        <span className="preference-label">Calories:</span>
                        <span className="preference-value">{plan.preferences.calories}</span>
                      </div>
                      <div className="preference-item">
                        <span className="preference-label">Meals:</span>
                        <span className="preference-value">{plan.preferences.meals}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MealPlanHistory; 