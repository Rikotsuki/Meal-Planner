const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/meal-planner', {
   useNewUrlParser: true,
   useUnifiedTopology: true,
 })
 .then(() => console.log('MongoDB connected'))
 .catch(err => console.error('MongoDB connection error:', err));