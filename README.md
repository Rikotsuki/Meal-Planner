# Meal Planner - MERN Stack Application

A modern meal planning application built with the MERN stack (MongoDB, Express.js, React, Node.js) inspired by [Eat This Much](https://www.eatthismuch.com/).

## 🚀 Features

- **Personalized Meal Plans**: Create meal plans based on your dietary preferences, calorie goals, and macro requirements
- **Multiple Diet Support**: Keto, Mediterranean, Paleo, Vegan, Vegetarian, and custom diets
- **Macro Tracking**: Set specific targets for carbs, fat, and protein
- **Modern UI**: Beautiful, responsive design with smooth animations
- **Real-time Updates**: Dynamic meal plan generation
- **Grocery Lists**: Automatic grocery list generation based on meal plans

## 📁 Project Structure

```
Meal Planner/
├── backend/                 # Express.js API server
│   ├── server.js           # Main server file
│   ├── package.json        # Backend dependencies
│   └── env.example         # Environment variables template
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── LandingPage.jsx
│   │   │   └── LandingPage.css
│   │   ├── App.jsx         # Main app component
│   │   ├── main.jsx        # React entry point
│   │   └── index.css       # Global styles
│   ├── index.html          # HTML template
│   ├── package.json        # Frontend dependencies
│   └── vite.config.js      # Vite configuration
└── README.md              # This file
```

## 🛠️ Tech Stack

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **CORS**: Cross-origin resource sharing
- **dotenv**: Environment variables

### Frontend
- **React 18**: UI library
- **Vite**: Build tool and dev server
- **React Router**: Client-side routing
- **Axios**: HTTP client for API calls
- **CSS3**: Modern styling with gradients and animations

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd meal-planner
   ```

2. **Set up the backend**
   ```bash
   cd backend
   npm install
   cp env.example .env
   # Edit .env with your MongoDB URI
   npm run dev
   ```

3. **Set up the frontend**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📝 Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/meal-planner
NODE_ENV=development
```

## 🎨 UI Features

The landing page includes:
- **Hero Section**: Eye-catching gradient background with compelling copy
- **Meal Plan Generator**: Interactive form with diet selection, calorie input, and macro tracking
- **Responsive Design**: Mobile-first approach with smooth animations
- **Modern Styling**: Clean, professional design inspired by Eat This Much

## 🔧 Development Scripts

### Backend
```bash
npm run dev    # Start development server with nodemon
npm start      # Start production server
```

### Frontend
```bash
npm run dev    # Start development server
npm run build  # Build for production
npm run preview # Preview production build
```

## 🚧 TODO

- [ ] Implement user authentication
- [ ] Add meal plan generation algorithm
- [ ] Create recipe database
- [ ] Add grocery list functionality
- [ ] Implement meal plan saving/loading
- [ ] Add user preferences and history
- [ ] Create mobile app versions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Inspired by [Eat This Much](https://www.eatthismuch.com/)
- Built with modern web technologies
- Designed for optimal user experience 