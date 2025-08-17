import React, { useState, useEffect } from "react";
import { groceryListAPI, mealPlanAPI } from "../../services/api";
import "./GroceryLists.css";

const GroceryLists = () => {
  const [groceryLists, setGroceryLists] = useState([]);
  const [mealPlans, setMealPlans] = useState([]);
  const [selectedMealPlan, setSelectedMealPlan] = useState("");
  const [isLoadingLists, setIsLoadingLists] = useState(true);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchGroceryLists();
    fetchMealPlans();
  }, []);

  const fetchGroceryLists = async () => {
    try {
      setIsLoadingLists(true);
      const res = await groceryListAPI.getUserGroceryLists();
      setGroceryLists(res.data || []);
    } catch (err) {
      setError("Failed to load grocery lists");
      console.error("Fetch grocery lists error:", err);
    } finally {
      setIsLoadingLists(false);
    }
  };

  const fetchMealPlans = async () => {
    try {
      setIsLoadingPlans(true);
      const res = await mealPlanAPI.getUserMealPlans();
      setMealPlans(res.data || []);
    } catch (err) {
      console.error("Fetch meal plans error:", err);
    } finally {
      setIsLoadingPlans(false);
    }
  };

  const handleGenerateGroceryList = async () => {
    if (!selectedMealPlan) {
      setError("Please select a meal plan first");
      return;
    }

    try {
      setIsGenerating(true);
      setError("");

      /**
       * IMPORTANT: This should call your backend route:
       * POST /api/grocery/from-meal-plan/:mealPlanId
       * If your service is different, ensure it hits that path param form.
       */
      const res = await groceryListAPI.createFromMealPlan(selectedMealPlan);

      // Put newest at the top
      setGroceryLists((prev) => [res.data, ...prev]);
      setSelectedMealPlan("");
      // Optional: replace alert with a toast/banner later
      alert("Grocery list generated successfully!");
    } catch (err) {
      const serverMsg = err?.response?.data?.message;
      setError(serverMsg || "Failed to generate grocery list");
      console.error("Generate grocery list error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

  const isLoading = isLoadingLists; // keep your main spinner behavior

  if (isLoading) {
    return (
      <div className="grocery-lists">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading your grocery lists...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grocery-lists">
      <div className="lists-container">
        <h2>Grocery Lists</h2>
        <p className="lists-subtitle">
          View and manage your grocery lists generated from meal plans
        </p>

        {/* Generate New Grocery List Section */}
        <div className="generate-section">
          <h3>Generate New Grocery List</h3>
          <div className="generate-form">
            <select
              value={selectedMealPlan}
              onChange={(e) => setSelectedMealPlan(e.target.value)}
              className="meal-plan-select"
              disabled={isLoadingPlans}
            >
              <option value="">
                {isLoadingPlans ? "Loading meal plans…" : "Select a meal plan…"}
              </option>
              {mealPlans.map((plan) => (
                <option key={plan._id} value={plan._id}>
                  {plan.name} ({plan.mealNames?.length || 0} meals)
                </option>
              ))}
            </select>
            <button
              onClick={handleGenerateGroceryList}
              disabled={!selectedMealPlan || isGenerating}
              className="generate-btn"
            >
              {isGenerating ? "Generating..." : "Generate Grocery List"}
            </button>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {groceryLists.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🛒</div>
            <h3>No grocery lists yet</h3>
            <p>Generate a meal plan first to create grocery lists!</p>
          </div>
        ) : (
          <div className="grocery-lists-grid">
            {groceryLists.map((list) => (
              <div key={list._id} className="grocery-list-card">
                <div className="list-header">
                  <h3>{list.name || "Grocery List"}</h3>
                  <span className="list-date">
                    {formatDate(list.createdAt)}
                  </span>
                </div>

                <div className="list-items">
                  <h4>Items ({list.items?.length || 0})</h4>

                  {list.items && list.items.length > 0 ? (
                    <div className="items-list">
                      {(() => {
                        // 1) Group by AISLE
                        const byAisle = {};
                        (list.items || []).forEach((item) => {
                          const aisle = item.aisle || "Other";
                          (byAisle[aisle] ||= []).push(item);
                        });

                        const aisles = Object.keys(byAisle).sort((a, b) =>
                          a.localeCompare(b)
                        );

                        return aisles.map((aisle) => {
                          // 2) Within an aisle, group by MEAL
                          const byMeal = {};
                          byAisle[aisle].forEach((item) => {
                            // Prefer new schema: mealNames[], fallback to mealName and split old "A • B • C"
                            const meals =
                              Array.isArray(item.mealNames) &&
                              item.mealNames.length
                                ? item.mealNames
                                : item.mealName
                                ? item.mealName.split(" • ").filter(Boolean)
                                : ["Meal"];
                            meals.forEach((m) => {
                              (byMeal[m] ||= []).push(item);
                            });
                          });

                          const meals = Object.keys(byMeal).sort((a, b) =>
                            a.localeCompare(b)
                          );

                          return (
                            <div key={aisle} className="meal-section">
                              <h5 className="meal-title">{aisle}</h5>

                              {meals.map((meal) => (
                                <div
                                  key={`${aisle}-${meal}`}
                                  className="meal-subsection"
                                >
                                  <h6 className="meal-subtitle">{meal}</h6>
                                  <div className="meal-items">
                                    {byMeal[meal]
                                      .sort((a, b) =>
                                        a.name.localeCompare(b.name)
                                      )
                                      .map((item) => (
                                        <div
                                          key={
                                            item._id ||
                                            `${meal}-${item.name}-${
                                              item.unit || "count"
                                            }`
                                          }
                                          className="grocery-item"
                                        >
                                          <span className="item-name">
                                            {item.name}
                                          </span>
                                          <span className="item-amount">
                                            {item.amount}
                                            {item.unit ? ` ${item.unit}` : ""}
                                          </span>
                                        </div>
                                      ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          );
                        });
                      })()}
                    </div>
                  ) : (
                    <p className="no-items">No items in this list</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GroceryLists;
