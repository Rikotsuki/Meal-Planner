import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import MealPlanGenerator from './MealPlanGenerator';
import MealPlanHistory from './MealPlanHistory';
import NutritionTracker from './NutritionTracker';
import GroceryLists from './GroceryLists';
import UserProfile from './UserProfile';

const Dashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('generator');
  const [isLoading, setIsLoading] = useState(false);

  const tabs = [
    { id: 'generator', label: 'Meal Generator', icon: '🍽️' },
    { id: 'history', label: 'My Plans', icon: '📅' },
    { id: 'nutrition', label: 'Nutrition', icon: '📊' },
    { id: 'grocery', label: 'Grocery Lists', icon: '🛒' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'generator':
        return <MealPlanGenerator />;
      case 'history':
        return <MealPlanHistory />;
      case 'nutrition':
        return <NutritionTracker />;
      case 'grocery':
        return <GroceryLists />;
      case 'profile':
        return <UserProfile user={user} />;
      default:
        return <MealPlanGenerator />;
    }
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <div className="dashboard-logo">
            <h1>Meal Planner</h1>
          </div>
          <div className="dashboard-user-info">
            <span className="user-greeting">Welcome, {user?.name || 'User'}!</span>
            <button className="logout-btn" onClick={onLogout}>
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="dashboard-nav">
        <div className="nav-container">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => handleTabChange(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="dashboard-content">
          {isLoading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading...</p>
            </div>
          ) : (
            renderActiveComponent()
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 