import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import SignUp from './SignUp';
import LogIn from './LogIn';
import BmiCalculator from './BmiCalculator';
import Recipes from './Recipes';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/SignUp" element={<SignUp />} />
    <Route path="/LogIn" element={<LogIn/>} />
    <Route path="/BmiCalculator" element={<BmiCalculator/>} />
        <Route path="/Recipe" element={<Recipes/>} />


        



      
      {/* Add other routes like <Route path="/bmi" element={<BWICalculator />} /> */}
    </Routes>
  </BrowserRouter>
);


function App() {
  return (
    <SignUp />
    
  );
}



export default App;
