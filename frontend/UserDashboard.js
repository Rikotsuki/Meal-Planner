import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Layout from './Layout';

const UserDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profileImage, setProfileImage] = useState("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24'%3E%3Cpath fill='%234CAF50' d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4s-4 1.79-4 4s1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E");
  const sidebarRef = useRef(null);
  const menuToggleRef = useRef(null);

  // Toggle sidebar on mobile
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Handle profile image upload
  const handleProfileUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (window.innerWidth < 768 && 
          sidebarRef.current && 
          !sidebarRef.current.contains(event.target) && 
          menuToggleRef.current && 
          !menuToggleRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <Layout>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white shadow-md p-4 z-10">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-green-600">MealPlanner</h1>
          <button 
            ref={menuToggleRef}
            onClick={toggleSidebar}
            className="text-gray-600"
          >
            <i className={`fas ${isSidebarOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
          </button>
        </div>
      </div>

      <div className="flex min-h-screen pt-12 md:pt-0">
        {/* Sidebar */}
        <aside 
          ref={sidebarRef}
          className={`w-64 bg-white border-r fixed h-full md:relative transform transition-transform duration-300 z-20 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          <div className="p-4 border-b">
            <h1 className="text-2xl font-bold text-green-600">MealPlanner</h1>
          </div>
          
          {/* Profile Section */}
          <div className="p-6 flex flex-col items-center border-b">
            <div className="relative mb-3">
              <img 
                src={profileImage} 
                alt="Profile" 
                className="w-20 h-20 rounded-full object-cover profile-image cursor-pointer"
              />
              <input 
                type="file" 
                id="profileUpload" 
                accept="image/*" 
                className="hidden" 
                onChange={handleProfileUpload}
              />
              <button 
                onClick={() => document.getElementById('profileUpload').click()} 
                className="absolute bottom-0 right-0 bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center"
              >
                <i className="fas fa-camera text-xs"></i>
              </button>
            </div>
            <h2 className="text-lg font-semibold">Kay</h2>
          </div>
          
          <nav className="p-4 space-y-2 text-sm">

            <Link to="/planner" className="block sidebar-link hover:text-green-600">
                <i className="fas fa-calendar-alt mr-3 text-green-500"></i>
                  <span>Planner</span>
            </Link>
              
            <Link to="/groceries" className="block sidebar-link hover:text-green-600">
              <i className="fas fa-shopping-cart mr-3 text-green-500"></i>
              <span>Groceries</span>
            </Link>

             <Link to="/CustomRecipes" className="block sidebar-link hover:text-green-600">
              <i className="fas fa-utensils mr-3 text-green-500"></i>
              <span>Custom Recipes</span>
            </Link>

            <Link to="/SavedPlans" className="block sidebar-link hover:text-green-600">
              <i className="fas fa-save mr-3 text-green-500"></i>
              <span>Saved Plans</span>
            </Link>

            <Link to="/DietNutrition" className="block sidebar-link hover:text-green-600">
              <i className="fas fa-chart-pie mr-3 text-green-500"></i>
              <span>Diet & Nutrition</span>
            </Link>

            <Link to="/Schedule" className="block sidebar-link hover:text-green-600">
              <i className="fas fa-clock mr-3 text-green-500"></i>
              <span>Schedule</span>
            </Link>

            <Link to="/WeightGoals" className="block sidebar-link hover:text-green-600">
              <i className="fas fa-weight-scale mr-3 text-green-500"></i>
              <span>Weight Goals</span>
            </Link>

          <Link to="/Account" className="block sidebar-link hover:text-green-600">
              <i className="fas fa-user mr-3 text-green-500"></i>
              <span>Account</span>
            </Link>

          <Link to="/Help" className="block sidebar-link hover:text-green-600">  
          <i className="fas fa-question-circle mr-3 text-green-500"></i>
              <span>Help</span>
            </Link>

          <Link to="/LogOut" className="block sidebar-link hover:text-green-600">
            <i className="fas fa-sign-out-alt mr-3 text-green-500"></i>
              <span>Log out</span>
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 md:ml-0">
          {/* Header Controls */}
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div className="space-x-3">
              <button className="bg-green-600 text-white px-4 py-2 rounded-full font-medium shadow-md hover:bg-green-500 transition">Day</button>
              <button className="text-gray-600 hover:text-green-600 px-4 py-2 font-medium">Week</button>
              <button className="text-gray-600 hover:text-green-600 px-4 py-2 font-medium">Month</button>
            </div>
            <h2 className="text-xl font-bold text-gray-700">
              <i className="fas fa-calendar-day text-green-600 mr-2"></i>
              Today – July 25, 2025
            </h2>
            <button className="bg-green-600 text-white px-6 py-2 rounded-full font-medium shadow-md hover:bg-green-500 transition flex items-center">
              <i className="fas fa-edit mr-2"></i>
              Edit Day
            </button>
          </div>

          {/* Rest of your dashboard content... */}
          {/* ... (include all your meal cards, nutrition charts, etc.) ... */}
          
        </main>
      </div>

      {/* Embedded CSS */}
      <style jsx>{`
        .profile-image {
          transition: all 0.3s ease;
          border: 3px solid #4CAF50;
        }
        
        .profile-image:hover {
          transform: scale(1.05);
          border-color: #FF9800;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        .sidebar-link {
          transition: all 0.3s ease;
          border-radius: 8px;
          padding: 12px 15px;
        }
        
        .sidebar-link:hover {
          background-color: #e8f5e9;
          transform: translateX(5px);
          color: #4CAF50;
        }
        
        @media (max-width: 768px) {
          .main-content {
            padding-top: 70px;
          }
        }
      `}</style>
    </Layout>
  );
};

export default UserDashboard;
