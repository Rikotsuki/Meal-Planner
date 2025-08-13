import React, { useState, useEffect } from 'react';
import { nutritionAPI } from '../../services/api';
import './NutritionTracker.css';

const NutritionTracker = () => {
  const [nutritionData, setNutritionData] = useState({
    calories: '',
    carbs: '',
    fat: '',
    protein: '',
    fiber: '',
    sodium: '',
    cholesterol: ''
  });
  
  const [history, setHistory] = useState([]);
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNutritionHistory();
    fetchNutritionSummary();
  }, []);

  const fetchNutritionHistory = async () => {
    try {
      const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // Last 7 days
      const endDate = new Date();
      
      const response = await nutritionAPI.getNutritionHistory(
        startDate.toISOString(),
        endDate.toISOString()
      );
      setHistory(response.data);
    } catch (error) {
      console.error('Fetch nutrition history error:', error);
    }
  };

  const fetchNutritionSummary = async () => {
    try {
      const response = await nutritionAPI.getNutritionSummary('week');
      setSummary(response.data);
    } catch (error) {
      console.error('Fetch nutrition summary error:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setNutritionData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await nutritionAPI.trackDailyNutrition(new Date(), nutritionData);
      
      // Reset form
      setNutritionData({
        calories: '',
        carbs: '',
        fat: '',
        protein: '',
        fiber: '',
        sodium: '',
        cholesterol: ''
      });
      
      // Refresh data
      await fetchNutritionHistory();
      await fetchNutritionSummary();
      
      alert('Nutrition data saved successfully!');
    } catch (error) {
      setError('Failed to save nutrition data');
      console.error('Save nutrition error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="nutrition-tracker">
      <div className="tracker-container">
        <h2>Nutrition Tracker</h2>
        <p className="tracker-subtitle">
          Track your daily nutrition intake and view your progress
        </p>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="tracker-content">
          {/* Add Nutrition Form */}
          <div className="add-nutrition-section">
            <h3>Add Today's Nutrition</h3>
            <form onSubmit={handleSubmit} className="nutrition-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Calories</label>
                  <input
                    type="number"
                    value={nutritionData.calories}
                    onChange={(e) => handleInputChange('calories', e.target.value)}
                    placeholder="Enter calories"
                  />
                </div>
                
                <div className="form-group">
                  <label>Carbs (g)</label>
                  <input
                    type="number"
                    value={nutritionData.carbs}
                    onChange={(e) => handleInputChange('carbs', e.target.value)}
                    placeholder="Enter carbs"
                  />
                </div>
                
                <div className="form-group">
                  <label>Fat (g)</label>
                  <input
                    type="number"
                    value={nutritionData.fat}
                    onChange={(e) => handleInputChange('fat', e.target.value)}
                    placeholder="Enter fat"
                  />
                </div>
                
                <div className="form-group">
                  <label>Protein (g)</label>
                  <input
                    type="number"
                    value={nutritionData.protein}
                    onChange={(e) => handleInputChange('protein', e.target.value)}
                    placeholder="Enter protein"
                  />
                </div>
                
                <div className="form-group">
                  <label>Fiber (g)</label>
                  <input
                    type="number"
                    value={nutritionData.fiber}
                    onChange={(e) => handleInputChange('fiber', e.target.value)}
                    placeholder="Enter fiber"
                  />
                </div>
                
                <div className="form-group">
                  <label>Sodium (mg)</label>
                  <input
                    type="number"
                    value={nutritionData.sodium}
                    onChange={(e) => handleInputChange('sodium', e.target.value)}
                    placeholder="Enter sodium"
                  />
                </div>
              </div>
              
              <button 
                type="submit" 
                className="save-btn"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Nutrition Data'}
              </button>
            </form>
          </div>

          {/* Nutrition Summary */}
          {summary && (
            <div className="nutrition-summary-section">
              <h3>Weekly Summary</h3>
              <div className="summary-grid">
                <div className="summary-item">
                  <span className="summary-label">Average Calories</span>
                  <span className="summary-value">{summary.averageCalories}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Average Carbs</span>
                  <span className="summary-value">{summary.averageCarbs}g</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Average Fat</span>
                  <span className="summary-value">{summary.averageFat}g</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Average Protein</span>
                  <span className="summary-value">{summary.averageProtein}g</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Average Fiber</span>
                  <span className="summary-value">{summary.averageFiber}g</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Days Tracked</span>
                  <span className="summary-value">{summary.totalDays}</span>
                </div>
              </div>
            </div>
          )}

          {/* Nutrition History */}
          <div className="nutrition-history-section">
            <h3>Recent History</h3>
            {history.length === 0 ? (
              <div className="empty-history">
                <p>No nutrition data recorded yet. Start tracking today!</p>
              </div>
            ) : (
              <div className="history-list">
                {history.slice(0, 7).map((entry, index) => (
                  <div key={index} className="history-item">
                    <div className="history-date">
                      {formatDate(entry.date)}
                    </div>
                    <div className="history-nutrition">
                      <span className="nutrition-calories">
                        {entry.nutrition?.totals?.calories || 0} cal
                      </span>
                      <span className="nutrition-macros">
                        C: {entry.nutrition?.totals?.carbs || 0}g | 
                        F: {entry.nutrition?.totals?.fat || 0}g | 
                        P: {entry.nutrition?.totals?.protein || 0}g
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionTracker; 