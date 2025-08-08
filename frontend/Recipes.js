import React from 'react';

const Recipes = () => {
  // Search functionality
  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      const searchTerm = e.target.value.trim();
      if (searchTerm) {
        alert(`Searching for: ${searchTerm}`);
      }
    }
  };

  // Add recipe button
  const handleAddRecipe = () => {
    alert('Add new recipe feature would open here');
  };

  return (
    <div className="container">
      {/* Header with Search */}
      <header className="flex justify-between items-center py-5 mb-8 border-b border-gray-200">
        <div className="logo flex items-center gap-2.5 text-3xl font-bold text-green-400">
          <i className="fas fa-utensils text-4xl"></i>
          <span>MealPlanner</span>
        </div>
        
        <div className="search-container flex-1 max-w-[500px] mx-8 relative">
          <i className="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input 
            type="text" 
            placeholder="Type here to search..." 
            className="w-full py-3 px-5 pl-12 rounded-full border border-slate-300 text-base bg-white shadow-sm"
            onKeyUp={handleSearch}
          />
        </div>
        
        <div className="user-actions flex items-center gap-5">
          <button 
            className="btn py-2.5 px-5 rounded-full bg-green-400 text-white font-medium border-none cursor-pointer transition-all duration-300 flex items-center gap-2 hover:bg-green-500 hover:-translate-y-0.5 hover:shadow-md"
            onClick={handleAddRecipe}
          >
            <i className="fas fa-plus"></i>
            <span>Custom Recipe</span>
          </button>
          <div className="user-profile flex items-center gap-2.5">
            <div className="profile-pic w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-cyan-400 flex items-center justify-center text-white font-bold text-lg">K</div>
            <span><a href="userdashboard.html" className="text-current no-underline">Kay</a></span>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="results-header mb-8 text-center">
        <h1 className="text-4xl text-slate-800 mb-2.5">Recipe Search Results</h1>
        <p className="text-slate-500 max-w-[600px] mx-auto">Discover delicious recipes tailored to your preferences</p>
      </div>
      
      <div className="results-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {/* Category 1 */}
        <div className="recipe-category bg-white rounded-2xl overflow-hidden shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div className="category-header p-5 bg-slate-50 border-b border-slate-200">
            <h2 className="text-xl text-slate-800 flex items-center gap-2.5">
              <i className="fas fa-egg text-green-400"></i>
              <span>Breakfast Recipes</span>
            </h2>
          </div>
          <div className="recipe-list p-5">
            <div className="recipe-item flex justify-between items-center py-4 border-b border-dashed border-slate-200">
              <div className="recipe-name font-medium text-slate-800 flex items-center gap-4">
                <div className="recipe-image w-10 h-10 rounded-full bg-green-50 flex items-center justify-center overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1601000938251-9e0a8acee8a1?auto=format&fit=crop&w=200" 
                    alt="Hard-Boiled Eggs" 
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
                <span>Easy Hard-Boiled Eggs</span>
              </div>
              <div className="calories bg-green-50 text-green-400 py-1 px-3 rounded-full font-semibold text-sm min-w-[90px] text-center">72 Calories</div>
            </div>
            <div className="recipe-item flex justify-between items-center py-4 border-b border-dashed border-slate-200">
              <div className="recipe-name font-medium text-slate-800 flex items-center gap-4">
                <div className="recipe-image w-10 h-10 rounded-full bg-green-50 flex items-center justify-center overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1607532941433-304659e8198a?auto=format&fit=crop&w=200" 
                    alt="Chicken Caesar Salad" 
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
                <span>Chicken Caesar Salad</span>
              </div>
              <div className="calories bg-green-50 text-green-400 py-1 px-3 rounded-full font-semibold text-sm min-w-[90px] text-center">345 Calories</div>
            </div>
            <div className="recipe-item flex justify-between items-center py-4">
              <div className="recipe-name font-medium text-slate-800 flex items-center gap-4">
                <div className="recipe-image w-10 h-10 rounded-full bg-green-50 flex items-center justify-center overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=200" 
                    alt="Spinach Scramble" 
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
                <span>Simple Spinach Scramble</span>
              </div>
              <div className="calories bg-green-50 text-green-400 py-1 px-3 rounded-full font-semibold text-sm min-w-[90px] text-center">235 Calories</div>
            </div>
          </div>
        </div>
        
        {/* Category 2 */}
        <div className="recipe-category bg-white rounded-2xl overflow-hidden shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div className="category-header p-5 bg-slate-50 border-b border-slate-200">
            <h2 className="text-xl text-slate-800 flex items-center gap-2.5">
              <i className="fas fa-drumstick-bite text-green-400"></i>
              <span>Chicken Dishes</span>
            </h2>
          </div>
          <div className="recipe-list p-5">
            <div className="recipe-item flex justify-between items-center py-4 border-b border-dashed border-slate-200">
              <div className="recipe-name font-medium text-slate-800 flex items-center gap-4">
                <div className="recipe-image w-10 h-10 rounded-full bg-green-50 flex items-center justify-center overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1603360946369-dc9bbf814ecf?auto=format&fit=crop&w=200" 
                    alt="Garlic Chicken" 
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
                <span>Easy Garlic Chicken</span>
              </div>
              <div className="calories bg-green-50 text-green-400 py-1 px-3 rounded-full font-semibold text-sm min-w-[90px] text-center">225 Calories</div>
            </div>
            <div className="recipe-item flex justify-between items-center py-4 border-b border-dashed border-slate-200">
              <div className="recipe-name font-medium text-slate-800 flex items-center gap-4">
                <div className="recipe-image w-10 h-10 rounded-full bg-green-50 flex items-center justify-center overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1606470035090-9b0a5c0d9e3a?auto=format&fit=crop&w=200" 
                    alt="Coconut Shake" 
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
                <span>Coconut Milk Protein Shake</span>
              </div>
              <div className="calories bg-green-50 text-green-400 py-1 px-3 rounded-full font-semibold text-sm min-w-[90px] text-center">360 Calories</div>
            </div>
            <div className="recipe-item flex justify-between items-center py-4">
              <div className="recipe-name font-medium text-slate-800 flex items-center gap-4">
                <div className="recipe-image w-10 h-10 rounded-full bg-green-50 flex items-center justify-center overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=200" 
                    alt="Chicken Teriyaki" 
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
                <span>Easy Garlic Chicken Teriyaki</span>
              </div>
              <div className="calories bg-green-50 text-green-400 py-1 px-3 rounded-full font-semibold text-sm min-w-[90px] text-center">310 Calories</div>
            </div>
          </div>
        </div>
        
        {/* Category 3 */}
        <div className="recipe-category bg-white rounded-2xl overflow-hidden shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div className="category-header p-5 bg-slate-50 border-b border-slate-200">
            <h2 className="text-xl text-slate-800 flex items-center gap-2.5">
              <i className="fas fa-blender text-green-400"></i>
              <span>Shakes & Smoothies</span>
            </h2>
          </div>
          <div className="recipe-list p-5">
            <div className="recipe-item flex justify-between items-center py-4 border-b border-dashed border-slate-200">
              <div className="recipe-name font-medium text-slate-800 flex items-center gap-4">
                <div className="recipe-image w-10 h-10 rounded-full bg-green-50 flex items-center justify-center overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1505252585461-04db1a846087?auto=format&fit=crop&w=200" 
                    alt="Protein Shake" 
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
                <span>Oatmeal Banana Protein Shake</span>
              </div>
              <div className="calories bg-green-50 text-green-400 py-1 px-3 rounded-full font-semibold text-sm min-w-[90px] text-center">545 Calories</div>
            </div>
            <div className="recipe-item flex justify-between items-center py-4 border-b border-dashed border-slate-200">
              <div className="recipe-name font-medium text-slate-800 flex items-center gap-4">
                <div className="recipe-image w-10 h-10 rounded-full bg-green-50 flex items-center justify-center overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1547516505-4d3aa0a4d61d?auto=format&fit=crop&w=200" 
                    alt="Sweet Potato" 
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
                <span>Manganese Sweet Potato</span>
              </div>
              <div className="calories bg-green-50 text-green-400 py-1 px-3 rounded-full font-semibold text-sm min-w-[90px] text-center">112 Calories</div>
            </div>
            <div className="recipe-item flex justify-between items-center py-4">
              <div className="recipe-name font-medium text-slate-800 flex items-center gap-4">
                <div className="recipe-image w-10 h-10 rounded-full bg-green-50 flex items-center justify-center overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1594489573454-3a9e7b2c4ed3?auto=format&fit=crop&w=200" 
                    alt="Rehydrating Gum" 
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
                <span>Rehydrating Gum</span>
              </div>
              <div className="calories bg-green-50 text-green-400 py-1 px-3 rounded-full font-semibold text-sm min-w-[90px] text-center">250 Calories</div>
            </div>
          </div>
        </div>
        
        {/* Category 4 */}
        <div className="recipe-category bg-white rounded-2xl overflow-hidden shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div className="category-header p-5 bg-slate-50 border-b border-slate-200">
            <h2 className="text-xl text-slate-800 flex items-center gap-2.5">
              <i className="fas fa-fish text-green-400"></i>
              <span>Seafood Specialties</span>
            </h2>
          </div>
          <div className="recipe-list p-5">
            <div className="recipe-item flex justify-between items-center py-4 border-b border-dashed border-slate-200">
              <div className="recipe-name font-medium text-slate-800 flex items-center gap-4">
                <div className="recipe-image w-10 h-10 rounded-full bg-green-50 flex items-center justify-center overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1599709604236-17d5ca4764c6?auto=format&fit=crop&w=200" 
                    alt="Tuna" 
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
                <span>All American Tuna</span>
              </div>
              <div className="calories bg-green-50 text-green-400 py-1 px-3 rounded-full font-semibold text-sm min-w-[90px] text-center">316 Calories</div>
            </div>
            <div className="recipe-item flex justify-between items-center py-4 border-b border-dashed border-slate-200">
              <div className="recipe-name font-medium text-slate-800 flex items-center gap-4">
                <div className="recipe-image w-10 h-10 rounded-full bg-green-50 flex items-center justify-center overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1606755962773-d324e7a7a7b6?auto=format&fit=crop&w=200" 
                    alt="Tuna Salad" 
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
                <span>Tuna Salad</span>
              </div>
              <div className="calories bg-green-50 text-green-400 py-1 px-3 rounded-full font-semibold text-sm min-w-[90px] text-center">237 Calories</div>
            </div>
            <div className="recipe-item flex justify-between items-center py-4">
              <div className="recipe-name font-medium text-slate-800 flex items-center gap-4">
                <div className="recipe-image w-10 h-10 rounded-full bg-green-50 flex items-center justify-center overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1606755699178-3d0bd2f2d1b1?auto=format&fit=crop&w=200" 
                    alt="Avocado Tuna" 
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
                <span>Pico Avocado Tuna Salad</span>
              </div>
              <div className="calories bg-green-50 text-green-400 py-1 px-3 rounded-full font-semibold text-sm min-w-[90px] text-center">505 Calories</div>
            </div>
          </div>
        </div>
        
        {/* Category 5 */}
        <div className="recipe-category bg-white rounded-2xl overflow-hidden shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div className="category-header p-5 bg-slate-50 border-b border-slate-200">
            <h2 className="text-xl text-slate-800 flex items-center gap-2.5">
              <i className="fas fa-leaf text-green-400"></i>
              <span>Salads & Sides</span>
            </h2>
          </div>
          <div className="recipe-list p-5">
            <div className="recipe-item flex justify-between items-center py-4 border-b border-dashed border-slate-200">
              <div className="recipe-name font-medium text-slate-800 flex items-center gap-4">
                <div className="recipe-image w-10 h-10 rounded-full bg-green-50 flex items-center justify-center overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1607532890889-84beb7f8f1c1?auto=format&fit=crop&w=200" 
                    alt="Avocado Salad" 
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
                <span>Chicken and Avocado Salad</span>
              </div>
              <div className="calories bg-green-50 text-green-400 py-1 px-3 rounded-full font-semibold text-sm min-w-[90px] text-center">245 Calories</div>
            </div>
            <div className="recipe-item flex justify-between items-center py-4 border-b border-dashed border-slate-200">
              <div className="recipe-name font-medium text-slate-800 flex items-center gap-4">
                <div className="recipe-image w-10 h-10 rounded-full bg-green-50 flex items-center justify-center overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1603360946369-dc9bbf814ecf?auto=format&fit=crop&w=200" 
                    alt="Chicken Kebab" 
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
                <span>Chicken Kebab</span>
              </div>
              <div className="calories bg-green-50 text-green-400 py-1 px-3 rounded-full font-semibold text-sm min-w-[90px] text-center">285 Calories</div>
            </div>
            <div className="recipe-item flex justify-between items-center py-4">
              <div className="recipe-name font-medium text-slate-800 flex items-center gap-4">
                <div className="recipe-image w-10 h-10 rounded-full bg-green-50 flex items-center justify-center overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1590179068383-b9c69aacebd3?auto=format&fit=crop&w=200" 
                    alt="Asparagus" 
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
                <span>Roasted Asparagus</span>
              </div>
              <div className="calories bg-green-50 text-green-400 py-1 px-3 rounded-full font-semibold text-sm min-w-[90px] text-center">95 Calories</div>
            </div>
          </div>
        </div>
        
        {/* Category 6 */}
        <div className="recipe-category bg-white rounded-2xl overflow-hidden shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div className="category-header p-5 bg-slate-50 border-b border-slate-200">
            <h2 className="text-xl text-slate-800 flex items-center gap-2.5">
              <i className="fas fa-fire text-green-400"></i>
              <span>Quick Stir-Fries</span>
            </h2>
          </div>
          <div className="recipe-list p-5">
            <div className="recipe-item flex justify-between items-center py-4 border-b border-dashed border-slate-200">
              <div className="recipe-name font-medium text-slate-800 flex items-center gap-4">
                <div className="recipe-image w-10 h-10 rounded-full bg-green-50 flex items-center justify-center overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1603893662172-99ed0cea2a08?auto=format&fit=crop&w=200" 
                    alt="Chicken Stir-Fry" 
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
                <span>Chicken Stir-Fry</span>
              </div>
              <div className="calories bg-green-50 text-green-400 py-1 px-3 rounded-full font-semibold text-sm min-w-[90px] text-center">450 Calories</div>
            </div>
            <div className="recipe-item flex justify-between items-center py-4 border-b border-dashed border-slate-200">
              <div className="recipe-name font-medium text-slate-800 flex items-center gap-4">
                <div className="recipe-image w-10 h-10 rounded-full bg-green-50 flex items-center justify-center overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1606755699178-3d0bd2f2d1b1?auto=format&fit=crop&w=200" 
                    alt="Cheesy Chicken" 
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
                <span>Cheesy Chicken and Spinach</span>
              </div>
              <div className="calories bg-green-50 text-green-400 py-1 px-3 rounded-full font-semibold text-sm min-w-[90px] text-center">505 Calories</div>
            </div>
            <div className="recipe-item flex justify-between items-center py-4">
              <div className="recipe-name font-medium text-slate-800 flex items-center gap-4">
                <div className="recipe-image w-10 h-10 rounded-full bg-green-50 flex items-center justify-center overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1606755962773-d324e7a7a7b6?auto=format&fit=crop&w=200" 
                    alt="Beef Stir Fry" 
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
                <span>Beef Stir Fry</span>
              </div>
              <div className="calories bg-green-50 text-green-400 py-1 px-3 rounded-full font-semibold text-sm min-w-[90px] text-center">342 Calories</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-green-700 text-white py-10 px-8">
        <div className="flex flex-col md:flex-row justify-between max-w-6xl mx-auto">
          <div>
            <h4 className="font-bold text-lg mb-3">MealPlanner</h4>
            <p className="text-sm">Eat better. Live better.</p>
          </div>
          <div className="space-y-2 mt-6 md:mt-0">
            
          </div>
        </div>
        <p className="text-center text-sm mt-6">&copy; 2025 Meal Planner. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Recipes;
