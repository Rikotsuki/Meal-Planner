import React, { useState, useEffect } from 'react';
import { groceryListAPI, mealPlanAPI } from '../../services/api';
import './GroceryLists.css';

const GroceryLists = () => {
  const [groceryLists, setGroceryLists] = useState([]);
  const [mealPlans, setMealPlans] = useState([]);
  const [selectedMealPlan, setSelectedMealPlan] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGroceryLists();
    fetchMealPlans();
  }, []);

  const fetchGroceryLists = async () => {
    try {
      setIsLoading(true);
      const response = await groceryListAPI.getUserGroceryLists();
      setGroceryLists(response.data);
    } catch (error) {
      setError('Failed to load grocery lists');
      console.error('Fetch grocery lists error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMealPlans = async () => {
    try {
      const response = await mealPlanAPI.getUserMealPlans();
      setMealPlans(response.data);
    } catch (error) {
      console.error('Fetch meal plans error:', error);
    }
  };

  const handleGenerateGroceryList = async () => {
    if (!selectedMealPlan) {
      setError('Please select a meal plan first');
      return;
    }

    try {
      setIsGenerating(true);
      setError('');
      const response = await groceryListAPI.createGroceryList(selectedMealPlan);
      setGroceryLists(prev => [response.data, ...prev]);
      setSelectedMealPlan('');
      alert('Grocery list generated successfully!');
    } catch (error) {
      setError('Failed to generate grocery list');
      console.error('Generate grocery list error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="grocery-lists">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading your grocery lists...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grocery-lists">
      <div className="lists-container">
        <h2>Grocery Lists</h2>
        <p className="lists-subtitle">
          View and manage your grocery lists generated from meal plans
        </p>

        {/* Generate New Grocery List Section */}
        <div className="generate-section">
          <h3>Generate New Grocery List</h3>
          <div className="generate-form">
            <select
              value={selectedMealPlan}
              onChange={(e) => setSelectedMealPlan(e.target.value)}
              className="meal-plan-select"
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
              disabled={!selectedMealPlan || isGenerating}
              className="generate-btn"
            >
              {isGenerating ? 'Generating...' : 'Generate Grocery List'}
            </button>
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {groceryLists.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🛒</div>
            <h3>No grocery lists yet</h3>
            <p>Generate a meal plan first to create grocery lists!</p>
          </div>
        ) : (
          <div className="grocery-lists-grid">
            {groceryLists.map((list) => (
              <div key={list.id} className="grocery-list-card">
                <div className="list-header">
                  <h3>Grocery List</h3>
                  <span className="list-date">{formatDate(list.createdAt)}</span>
                </div>
                
                <div className="list-items">
                  <h4>Items ({list.items?.length || 0})</h4>
                  {list.items && list.items.length > 0 ? (
                    <div className="items-list">
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
                          <div key={mealName} className="meal-section">
                            <h5 className="meal-title">{mealName}</h5>
                            <div className="meal-items">
                              {items.map((item, index) => (
                                <div key={index} className="grocery-item">
                                  <span className="item-name">{item.name}</span>
                                  <span className="item-amount">
                                    {item.amount} {item.unit}
                                  </span>
                                  <span className="item-aisle">{item.aisle}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ));
                      })()}
                    </div>
                  ) : (
                    <p className="no-items">No items in this list</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GroceryLists; 