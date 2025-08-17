import axios from 'axios';

// Base URLs
const BACKEND_URL = 'http://localhost:5000/api';
const SPOONACULAR_URL = 'https://api.spoonacular.com/recipes';
const SPOONACULAR_API_KEY = 'ffa59392e0464e69ab02e0450094b60e';

// Create axios instances
const backendAPI = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const spoonacularAPI = axios.create({
  baseURL: SPOONACULAR_URL,
  params: {
    apiKey: SPOONACULAR_API_KEY,
  },
});

// Request interceptor to add auth token
backendAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
backendAPI.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await backendAPI.post('/auth/refresh', {
            refreshToken,
          });
          localStorage.setItem('token', response.data.accessToken);
          localStorage.setItem('refreshToken', response.data.refreshToken);
          return backendAPI.request(error.config);
        } catch (refreshError) {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.location.reload();
        }
      }
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  signup: (userData) => backendAPI.post('/auth/signup', userData),
  login: (credentials) => backendAPI.post('/auth/login', credentials),
  verifyEmail: (email, code) => backendAPI.post('/auth/verifyEmail', { email, code }),
  me: () => backendAPI.get('/auth/me'),
  logout: () => backendAPI.get('/auth/logout'),
  forgetPassword: (email) => backendAPI.post('/auth/forgetPassword', { email }),
};

// Profile API
export const profileAPI = {
  getProfile: () => backendAPI.get('/profile'),
  updateProfile: (profileData) => backendAPI.put('/profile', profileData),
  updatePreferences: (preferences) => backendAPI.put('/profile/preferences', preferences),
};

// Food Categories API
export const foodCategoriesAPI = {
  getAll: () => backendAPI.get('/foodCategories'),
  create: (categoryData) => backendAPI.post('/foodCategories', categoryData),
  update: (id, categoryData) => backendAPI.put(`/foodCategories/${id}`, categoryData),
  delete: (id) => backendAPI.delete(`/foodCategories/${id}`),
};

// Spoonacular API for recipes and meal planning
export const recipeAPI = {
  // Search recipes
  searchRecipes: (params) => spoonacularAPI.get('/complexSearch', { params }),
  
  // Get recipe information
  getRecipeInfo: (id) => spoonacularAPI.get(`/${id}/information`),
  
  // Get recipe instructions
  getRecipeInstructions: (id) => spoonacularAPI.get(`/${id}/analyzedInstructions`),
  
  // Get random recipes
  getRandomRecipes: (params) => spoonacularAPI.get('/random', { params }),
  
  // Get recipes by ingredients
  getRecipesByIngredients: (ingredients) => 
    spoonacularAPI.get('/findByIngredients', { 
      params: { ingredients: ingredients.join(',') } 
    }),
  
  // Get similar recipes
  getSimilarRecipes: (id) => spoonacularAPI.get(`/${id}/similar`),
  
  // Get recipe nutrition
  getRecipeNutrition: (id) => spoonacularAPI.get(`/${id}/nutritionWidget.json`),
  
  // Search recipes by diet
  searchByDiet: (diet, params = {}) => 
    spoonacularAPI.get('/complexSearch', { 
      params: { ...params, diet } 
    }),
  
  // Search recipes by cuisine
  searchByCuisine: (cuisine, params = {}) => 
    spoonacularAPI.get('/complexSearch', { 
      params: { ...params, cuisine } 
    }),
  
  // Get recipe by nutrients
  getRecipesByNutrients: (params) => 
    spoonacularAPI.get('/findByNutrients', { params }),
};

       // Meal Plan API (Backend)
       export const mealPlanAPI = {
         // Create meal plan
         createMealPlan: (mealPlanData) => backendAPI.post('/mealPlans', mealPlanData),
         
         // Get user's meal plans
         getUserMealPlans: () => backendAPI.get('/mealPlans'),
         
         // Get specific meal plan
         getMealPlan: (id) => backendAPI.get(`/mealPlans/${id}`),
         
         // Update meal plan
         updateMealPlan: (id, mealPlanData) => backendAPI.put(`/mealPlans/${id}`, mealPlanData),
         
         // Delete meal plan
         deleteMealPlan: (id) => backendAPI.delete(`/mealPlans/${id}`),
         
         // Get recipe details from Spoonacular
         getRecipeInfo: (id) => spoonacularAPI.get(`/${id}/information`),
         
         // Generate meal plan using Spoonacular
         generateMealPlan: async (preferences) => {
    const { calories, diet, meals, carbs, fat, protein } = preferences;
    
    // Calculate macro percentages
    const totalMacros = parseInt(carbs) + parseInt(fat) + parseInt(protein);
    const carbPercent = Math.round((parseInt(carbs) / totalMacros) * 100);
    const fatPercent = Math.round((parseInt(fat) / totalMacros) * 100);
    const proteinPercent = Math.round((parseInt(protein) / totalMacros) * 100);
    
    try {
      // Get recipes based on diet and macros
      const recipes = await recipeAPI.searchRecipes({
        diet: diet.toLowerCase(),
        maxCalories: calories,
        number: meals * 7, // 7 days worth of meals
        addRecipeNutrition: true,
        fillIngredients: true,
      });
      
      return {
        recipes: recipes.data.results,
        nutrition: {
          calories,
          carbs: { grams: carbs, percent: carbPercent },
          fat: { grams: fat, percent: fatPercent },
          protein: { grams: protein, percent: proteinPercent },
        },
      };
    } catch (error) {
      console.error('Error generating meal plan:', error);
      throw error;
    }
  },
};

// Grocery List API
export const groceryListAPI = {
  // Create grocery list from meal plan
  createGroceryList: (mealPlanId) => backendAPI.post(`/grocery-lists/from-meal-plan/${mealPlanId}`),
  
  // Get user's grocery lists
  getUserGroceryLists: () => backendAPI.get('/grocery-lists'),
  
  // Get specific grocery list
  getGroceryList: (id) => backendAPI.get(`/grocery-lists/${id}`),
  
  // Update grocery list
  updateGroceryList: (id, listData) => backendAPI.put(`/grocery-lists/${id}`, listData),
  
  // Delete grocery list
  deleteGroceryList: (id) => backendAPI.delete(`/grocery-lists/${id}`),
};

// Nutrition Tracking API
export const nutritionAPI = {
  // Test database connection
  testConnection: () => backendAPI.get('/nutrition/test'),
  
  // Track daily nutrition
  trackDailyNutrition: (date, nutritionData) => 
    backendAPI.post('/nutrition/daily', { date, ...nutritionData }),
  
  // Get nutrition history
  getNutritionHistory: (startDate, endDate) => 
    backendAPI.get('/nutrition/history', { params: { startDate, endDate } }),
  
  // Get nutrition summary
  getNutritionSummary: (period) => backendAPI.get(`/nutrition/summary/${period}`),
};

export default {
  auth: authAPI,
  profile: profileAPI,
  foodCategories: foodCategoriesAPI,
  recipes: recipeAPI,
  mealPlans: mealPlanAPI,
  groceryLists: groceryListAPI,
  nutrition: nutritionAPI,
}; 