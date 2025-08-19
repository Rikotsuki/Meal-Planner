import React from 'react'
import './LandingPage.css'

const LandingPage = ({ isAuthenticated, user, onLoginClick, onSignUpClick, onLogout }) => {
  const handleLogoClick = () => {
    // Scroll to top of the page when logo is clicked
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="logo">
            <h1 onClick={handleLogoClick} className="clickable-logo">PrepPal</h1>
          </div>
          <nav className="nav">
            <a href="#how-it-works">How It Works</a>
            <a href="#articles">Articles</a>
            <a href="#features">Features</a>
            {isAuthenticated ? (
              <div className="user-menu">
                <span className="user-greeting">Hello, {user?.name || 'User'}!</span>
                <button className="btn-secondary" onClick={onLogout}>Sign Out</button>
              </div>
            ) : (
              <>
                <button className="btn-secondary" onClick={onSignUpClick}>Sign Up</button>
                <button className="btn-primary" onClick={onLoginClick}>Sign In</button>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Put your diet on <span className="highlight">autopilot.</span>
            </h1>
            <p className="hero-subtitle">
              PrepPal creates personalized meal plans based on your food preferences, 
              budget, and schedule. Reach your diet and nutritional goals with our calorie 
              calculator, weekly meal plans, grocery lists and more.
            </p>
            {!isAuthenticated && (
              <div className="hero-buttons">
                <button className="btn-primary large" onClick={onSignUpClick}>Get Started Free</button>
                <button className="btn-secondary large" onClick={onLoginClick}>Sign In</button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section id="articles" className="articles">
        <div className="container">
          <h2 className="section-title">Latest Nutrition & Meal Planning Insights</h2>
          
          <div className="articles-grid">
            <article className="article-card">
              <div className="article-image">
                <img 
                  src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Healthy fruits and vegetables"
                  className="article-img"
                />
              </div>
              <div className="article-content">
                <span className="article-category">Nutrition</span>
                <h3>10 Essential Nutrients Your Body Needs Daily</h3>
                <p>Discover the key vitamins, minerals, and macronutrients that should be part of your daily diet for optimal health and energy levels.</p>
                <div className="article-meta">
                  <span className="read-time">5 min read</span>
                  <span className="publish-date">Updated 2 days ago</span>
                </div>
              </div>
            </article>

            <article className="article-card">
              <div className="article-image">
                <img 
                  src="https://www.budgetbytes.com/wp-content/uploads/2021/12/Easy-Chicken-and-Vegetable-Meal-Prep-line.jpg" 
                  alt="Meal preparation and food containers"
                  className="article-img"
                />
              </div>
              <div className="article-content">
                <span className="article-category">Meal Planning</span>
                <h3>Meal Prep 101: Save Time and Money</h3>
                <p>Learn the basics of meal preparation, from planning your weekly menu to storing food properly and maintaining variety in your diet.</p>
                <div className="article-meta">
                  <span className="read-time">7 min read</span>
                  <span className="publish-date">Updated 1 week ago</span>
                </div>
              </div>
            </article>

            <article className="article-card">
              <div className="article-image">
                <img 
                  src="https://images.immediate.co.uk/production/volatile/sites/30/2023/05/Meal-prep-pasta-dc3af38.jpg" 
                  alt="Fresh vegetables at farmers market"
                  className="article-img"
                />
              </div>
              <div className="article-content">
                <span className="article-category">Budget Cooking</span>
                <h3>Healthy Eating on a Budget: Smart Shopping Tips</h3>
                <p>Explore strategies for maintaining a nutritious diet without breaking the bank, including seasonal shopping and bulk buying techniques.</p>
                <div className="article-meta">
                  <span className="read-time">6 min read</span>
                  <span className="publish-date">Updated 3 days ago</span>
                </div>
              </div>
            </article>

            <article className="article-card">
              <div className="article-image">
                <img 
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Healthy weight loss meal"
                  className="article-img"
                />
              </div>
              <div className="article-content">
                <span className="article-category">Weight Management</span>
                <h3>Sustainable Weight Loss Through Smart Meal Planning</h3>
                <p>Understand how proper meal planning can support your weight loss goals while maintaining energy and preventing nutrient deficiencies.</p>
                <div className="article-meta">
                  <span className="read-time">8 min read</span>
                  <span className="publish-date">Updated 5 days ago</span>
                </div>
              </div>
            </article>

            <article className="article-card">
              <div className="article-image">
                <img 
                  src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Family dinner table"
                  className="article-img"
                />
              </div>
              <div className="article-content">
                <span className="article-category">Family Nutrition</span>
                <h3>Planning Meals for the Whole Family</h3>
                <p>Tips and strategies for creating meal plans that satisfy everyone in your household, from picky eaters to dietary restrictions.</p>
                <div className="article-meta">
                  <span className="read-time">6 min read</span>
                  <span className="publish-date">Updated 1 week ago</span>
                </div>
              </div>
            </article>

            <article className="article-card">
              <div className="article-image">
                <img 
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Seasonal fruits and vegetables"
                  className="article-img"
                />
              </div>
              <div className="article-content">
                <span className="article-category">Seasonal Eating</span>
                <h3>Eating with the Seasons: Benefits and Tips</h3>
                <p>Discover the advantages of seasonal eating, from better nutrition and taste to environmental benefits and cost savings.</p>
                <div className="article-meta">
                  <span className="read-time">4 min read</span>
                  <span className="publish-date">Updated 4 days ago</span>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="container">
          <h2 className="section-title">Eating smart has never been easier</h2>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🍽️</div>
              <h3>Follow any eating style or create your own</h3>
              <p>You can customize popular eating styles like vegan and paleo to match your needs and preferences.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">♻️</div>
              <h3>Reduce food waste</h3>
              <p>Planning ahead means less produce going bad in the fridge. Add what you already own to the virtual pantry and our algorithms will use it up with priority.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">😌</div>
              <h3>Take the anxiety out of picking what to eat</h3>
              <p>Make the important decisions ahead of time and on your own schedule. Then there's nothing to worry about when it's time to eat.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📝</div>
              <h3>Automatic grocery lists</h3>
              <p>No more skipping meals because you're missing ingredients. Review your meals for the week and the grocery list automatically updates.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <h2>Ready to transform your eating habits?</h2>
          <p>Join thousands of users who have already improved their nutrition and simplified their meal planning.</p>
          {!isAuthenticated ? (
            <button className="btn-primary large" onClick={onSignUpClick}>Create a free account →</button>
          ) : (
            <button className="btn-primary large">Start Planning Your Meals →</button>
          )}
        </div>
      </section>
    </div>
  )
}

export default LandingPage 
