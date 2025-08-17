import React, { useState, useEffect } from "react";
import { nutritionAPI } from "../../services/api";
import "./NutritionTracker.css";

const NutritionTracker = () => {
  const [nutritionData, setNutritionData] = useState({
    calories: "",
    carbs: "",
    fat: "",
    protein: "",
    fiber: "",
    sodium: "",
    cholesterol: ""
  });

  const [nutritionHistory, setNutritionHistory] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [pendingSaveData, setPendingSaveData] = useState(null);

  // Weekly data for chart
  const [weeklyData, setWeeklyData] = useState([]);

  useEffect(() => {
    fetchNutritionHistory();
    generateWeeklyData();
  }, []);

  const fetchNutritionHistory = async () => {
    try {
      console.log("Fetching nutrition history...");
      const response = await nutritionAPI.getNutritionHistory();
      console.log("Nutrition history response:", response);
      const history = response.data || [];
      console.log("Setting nutrition history:", history);
      setNutritionHistory(history);
    } catch (error) {
      console.error("Error fetching nutrition history:", error);
    }
  };

  const generateWeeklyData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const data = days.map(day => ({
      day,
      calories: Math.floor(Math.random() * 500) + 1500, // Random data for demo
      carbs: Math.floor(Math.random() * 100) + 150,
      protein: Math.floor(Math.random() * 50) + 80,
      fat: Math.floor(Math.random() * 30) + 50
    }));
    setWeeklyData(data);
  };

  const handleInputChange = (field, value) => {
    setNutritionData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage("");

    try {
      const today = new Date().toISOString().split('T')[0];
      console.log("Saving nutrition data:", { date: today, ...nutritionData });
      
      const response = await nutritionAPI.trackDailyNutrition(today, nutritionData);
      console.log("API response:", response);
      
      setMessage("Nutrition data saved successfully!");
      
      // Get existing data for today to add to it
      const existingData = nutritionHistory.find(item => item.date === today);
      
      // Create the saved data object by ADDING to existing data
      const savedData = {
        date: today,
        calories: (Number(existingData?.calories) || 0) + (Number(nutritionData.calories) || 0),
        carbs: (Number(existingData?.carbs) || 0) + (Number(nutritionData.carbs) || 0),
        protein: (Number(existingData?.protein) || 0) + (Number(nutritionData.protein) || 0),
        fat: (Number(existingData?.fat) || 0) + (Number(nutritionData.fat) || 0),
        fiber: (Number(existingData?.fiber) || 0) + (Number(nutritionData.fiber) || 0),
        sodium: (Number(existingData?.sodium) || 0) + (Number(nutritionData.sodium) || 0),
        cholesterol: (Number(existingData?.cholesterol) || 0) + (Number(nutritionData.cholesterol) || 0)
      };
      
      console.log("Existing data:", existingData);
      console.log("New data to add:", nutritionData);
      console.log("Combined saved data:", savedData);
      
      // Set pending save data to show immediately after form clear
      setPendingSaveData(savedData);
      
      // Immediately update the nutritionHistory for instant display
      setNutritionHistory(prev => {
        // Remove any existing entry for today and add the updated one
        const filtered = prev.filter(item => item.date !== today);
        const updated = [savedData, ...filtered];
        console.log("Updated nutrition history:", updated);
        return updated;
      });
      
      // Clear the form AFTER updating the history
      setNutritionData({
        calories: "",
        carbs: "",
        fat: "",
        protein: "",
        fiber: "",
        sodium: "",
        cholesterol: ""
      });
      
      // Also refresh from server to ensure consistency
      fetchNutritionHistory().then(() => {
        console.log("Server refresh completed");
        // Clear pending save data after server refresh
        setPendingSaveData(null);
      });
      generateWeeklyData(); // Refresh weekly data
    } catch (error) {
      console.error("Full error object:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
        setMessage(`Error: ${error.response.data.message || 'Failed to save nutrition data'}`);
      } else if (error.request) {
        console.error("No response received:", error.request);
        setMessage("Error: No response from server. Please check your connection.");
      } else {
        console.error("Error setting up request:", error.message);
        setMessage(`Error: ${error.message}`);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const calculateDailyTotals = () => {
    const today = new Date().toISOString().split('T')[0];
    
    // First check if we have pending save data (most recent)
    if (pendingSaveData && pendingSaveData.date === today) {
      console.log('Using pending save data:', pendingSaveData);
      return {
        calories: Number(pendingSaveData.calories) || 0,
        carbs: Number(pendingSaveData.carbs) || 0,
        protein: Number(pendingSaveData.protein) || 0,
        fat: Number(pendingSaveData.fat) || 0
      };
    }
    
    // Then check if we have today's data in nutritionHistory
    let todayData = nutritionHistory.find(item => item.date === today);
    
    // Debug logging
    console.log('calculateDailyTotals:', {
      today,
      nutritionHistory: nutritionHistory.length,
      todayData,
      nutritionData,
      pendingSaveData,
      hasPendingData: Object.values(nutritionData).some(val => val !== "")
    });
    
    // If no data in history, check if we have pending data to save
    if (!todayData && Object.values(nutritionData).some(val => val !== "")) {
      // Return the current form data as pending totals
      const pendingTotals = {
        calories: Number(nutritionData.calories) || 0,
        carbs: Number(nutritionData.carbs) || 0,
        protein: Number(nutritionData.protein) || 0,
        fat: Number(nutritionData.fat) || 0
      };
      console.log('Using pending data:', pendingTotals);
      return pendingTotals;
    }
    
    // Return data from history or zeros
    if (!todayData) {
      console.log('No data found, returning zeros');
      return { calories: 0, carbs: 0, protein: 0, fat: 0 };
    }
    
    const historyTotals = {
      calories: Number(todayData.calories) || 0,
      carbs: Number(todayData.carbs) || 0,
      protein: Number(todayData.protein) || 0,
      fat: Number(todayData.fat) || 0
    };
    console.log('Using history data:', historyTotals);
    return historyTotals;
  };

  const getProgressPercentage = (current, target) => {
    if (!target || target === 0) return 0;
    return Math.min((current / target) * 100, 100);
  };

  const dailyTotals = calculateDailyTotals();
  const targets = {
    calories: 2000,
    carbs: 250,
    protein: 150,
    fat: 67
  };

  return (
    <div className="nutrition-tracker">
      {/* Header */}
      <div className="tracker-header">
        <h2>Nutrition Tracker</h2>
        <p className="tracker-subtitle">Track your daily nutrition and see your progress</p>
      </div>

      {/* Daily Nutrition Input */}
      <div className="daily-nutrition">
        <h3>Add Today's Nutrition</h3>
        <form onSubmit={handleSubmit} className="nutrition-form">
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
            <label>Protein (g)</label>
            <input
              type="number"
              value={nutritionData.protein}
              onChange={(e) => handleInputChange('protein', e.target.value)}
              placeholder="Enter protein"
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
          <div className="form-group">
            <label>Cholesterol (mg)</label>
            <input
              type="number"
              value={nutritionData.cholesterol}
              onChange={(e) => handleInputChange('cholesterol', e.target.value)}
              placeholder="Enter cholesterol"
            />
          </div>
        </form>
        
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={isSaving}
          className="save-btn"
        >
          {isSaving ? "Saving..." : "Save Nutrition"}
        </button>

        {message && (
          <div style={{ 
            marginTop: '1rem', 
            padding: '1rem', 
            borderRadius: '8px',
            background: message.includes('Error') ? 'rgba(255, 107, 107, 0.2)' : 'rgba(76, 175, 80, 0.2)',
            color: message.includes('Error') ? '#ff6b6b' : '#4caf50',
            border: `1px solid ${message.includes('Error') ? 'rgba(255, 107, 107, 0.5)' : 'rgba(76, 175, 80, 0.5)'}`
          }}>
            {message}
          </div>
        )}
      </div>

      {/* Daily Summary Cards */}
      <div className="daily-summary">
        <div className="summary-card">
          <div className="summary-value">{dailyTotals.calories}</div>
          <div className="summary-label">Calories</div>
          <div className="summary-unit">kcal</div>
        </div>
        <div className="summary-card">
          <div className="summary-value">{dailyTotals.carbs}</div>
          <div className="summary-label">Carbs</div>
          <div className="summary-unit">g</div>
        </div>
        <div className="summary-card">
          <div className="summary-value">{dailyTotals.protein}</div>
          <div className="summary-label">Protein</div>
          <div className="summary-unit">g</div>
        </div>
        <div className="summary-card">
          <div className="summary-value">{dailyTotals.fat}</div>
          <div className="summary-label">Fat</div>
          <div className="summary-unit">g</div>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="progress-section">
        <div className="progress-item">
          <div className="progress-header">
            <span className="progress-label">Calories</span>
            <span className="progress-value">{dailyTotals.calories} / {targets.calories}</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${getProgressPercentage(dailyTotals.calories, targets.calories)}%` }}
            ></div>
          </div>
        </div>
        
        <div className="progress-item">
          <div className="progress-header">
            <span className="progress-label">Carbs</span>
            <span className="progress-value">{dailyTotals.carbs} / {targets.carbs}g</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${getProgressPercentage(dailyTotals.carbs, targets.carbs)}%` }}
            ></div>
          </div>
        </div>
        
        <div className="progress-item">
          <div className="progress-header">
            <span className="progress-label">Protein</span>
            <span className="progress-value">{dailyTotals.protein} / {targets.protein}g</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${getProgressPercentage(dailyTotals.protein, targets.protein)}%` }}
            ></div>
          </div>
        </div>
        
        <div className="progress-item">
          <div className="progress-header">
            <span className="progress-label">Fat</span>
            <span className="progress-value">{dailyTotals.fat} / {targets.fat}g</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${getProgressPercentage(dailyTotals.fat, targets.fat)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Weekly Summary Chart */}
      <div className="weekly-summary">
        <h3>Weekly Overview</h3>
        <div className="weekly-chart">
          {weeklyData.map((day, index) => (
            <div key={index} className="day-column">
              <div className="day-label">{day.day}</div>
              <div className="day-bar">
                <div 
                  className="day-fill" 
                  style={{ 
                    height: `${Math.min((day.calories / 2500) * 100, 100)}%` 
                  }}
                ></div>
                <div className="day-value">{day.calories}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Nutrition History */}
      <div className="nutrition-history">
        <div className="history-header">
          <h3 className="history-title">Recent History</h3>
        </div>
        
        {nutritionHistory.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <h3>No nutrition data yet</h3>
            <p>Start tracking your daily nutrition to see your history here!</p>
          </div>
        ) : (
          <div className="history-list">
            {nutritionHistory.slice(0, 5).map((item, index) => (
              <div key={index} className="history-item">
                <div className="history-date">
                  {new Date(item.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
                <div className="history-nutrition">
                  <div className="history-nutrition-item">
                    <div className="history-nutrition-value">{item.calories || 0}</div>
                    <div className="history-nutrition-label">Calories</div>
                  </div>
                  <div className="history-nutrition-item">
                    <div className="history-nutrition-value">{item.carbs || 0}g</div>
                    <div className="history-nutrition-label">Carbs</div>
                  </div>
                  <div className="history-nutrition-item">
                    <div className="history-nutrition-value">{item.protein || 0}g</div>
                    <div className="history-nutrition-label">Protein</div>
                  </div>
                  <div className="history-nutrition-item">
                    <div className="history-nutrition-value">{item.fat || 0}g</div>
                    <div className="history-nutrition-label">Fat</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NutritionTracker; 