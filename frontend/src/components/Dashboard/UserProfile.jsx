import React, { useState, useEffect } from 'react';
import { profileAPI } from '../../services/api';
import './UserProfile.css';

const UserProfile = ({ user }) => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    preferences: {
      diet: 'Eat Everything',
      calories: '2000',
      meals: '3',
      carbs: '250',
      fat: '67',
      protein: '150'
    }
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response = await profileAPI.getProfile();
      setProfile(response.data);
      setFormData({
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
      setError('Failed to load profile');
      console.error('Fetch profile error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      await profileAPI.updateProfile(formData);
      await fetchProfile();
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      setError('Failed to update profile');
      console.error('Update profile error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    fetchProfile(); // Reset form data
  };

  if (isLoading) {
    return (
      <div className="user-profile">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-profile">
      <div className="profile-container">
        <h2>User Profile</h2>
        <p className="profile-subtitle">
          Manage your account settings and preferences
        </p>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="profile-content">
          {/* Profile Information */}
          <div className="profile-section">
            <h3>Personal Information</h3>
            <div className="profile-form">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>

          {/* Dietary Preferences */}
          <div className="profile-section">
            <h3>Dietary Preferences</h3>
            <div className="preferences-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Preferred Diet</label>
                  <select
                    value={formData.preferences.diet}
                    onChange={(e) => handleInputChange('preferences.diet', e.target.value)}
                    disabled={!isEditing}
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
                
                <div className="form-group">
                  <label>Daily Calories</label>
                  <input
                    type="number"
                    value={formData.preferences.calories}
                    onChange={(e) => handleInputChange('preferences.calories', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Meals per Day</label>
                  <input
                    type="number"
                    value={formData.preferences.meals}
                    onChange={(e) => handleInputChange('preferences.meals', e.target.value)}
                    disabled={!isEditing}
                    min="1"
                    max="6"
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Carbs (g)</label>
                  <input
                    type="number"
                    value={formData.preferences.carbs}
                    onChange={(e) => handleInputChange('preferences.carbs', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="form-group">
                  <label>Fat (g)</label>
                  <input
                    type="number"
                    value={formData.preferences.fat}
                    onChange={(e) => handleInputChange('preferences.fat', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="form-group">
                  <label>Protein (g)</label>
                  <input
                    type="number"
                    value={formData.preferences.protein}
                    onChange={(e) => handleInputChange('preferences.protein', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="profile-actions">
            {isEditing ? (
              <>
                <button 
                  className="save-btn" 
                  onClick={handleSave}
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
                <button 
                  className="cancel-btn" 
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button 
                className="edit-btn" 
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 