# Quick Setup Guide

## 🚀 Get Started in 3 Steps

### 1. Install Dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Set Up Environment
```bash
# Copy environment template
cd backend
cp env.example .env

# Edit .env file with your MongoDB URI
# For local MongoDB: mongodb://localhost:27017/meal-planner
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/meal-planner
```

### 3. Start Development Servers
```bash
# From the root directory, start both servers
npm run dev

# Or start them separately:
# Backend: cd backend && npm run dev
# Frontend: cd frontend && npm run dev
```

## 🌐 Access Your Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 📝 What's Included

### Frontend Features
- ✅ Modern React 18 with Vite
- ✅ Beautiful landing page inspired by Eat This Much
- ✅ Responsive design with mobile support
- ✅ Interactive meal plan generator
- ✅ Diet selection (Keto, Mediterranean, Paleo, Vegan, Vegetarian)
- ✅ Calorie and macro tracking
- ✅ Smooth animations and modern UI

### Backend Features
- ✅ Express.js server with CORS enabled
- ✅ MongoDB connection ready
- ✅ Environment variable configuration
- ✅ Development server with hot reload
- ✅ API health check endpoint

## 🎯 Next Steps
1. Set up MongoDB (local or Atlas)
2. Implement meal plan generation algorithm
3. Add user authentication
4. Create recipe database
5. Add grocery list functionality

## 🐛 Troubleshooting
- If you get dependency errors, try: `npm install --legacy-peer-deps`
- If MongoDB connection fails, make sure MongoDB is running locally or update the URI in `.env`
- If ports are in use, change them in the respective config files 