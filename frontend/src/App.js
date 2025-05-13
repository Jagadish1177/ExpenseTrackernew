import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Categories from './components/Categories';
import Expenses from './components/Expenses';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/expenses" element={<Expenses />} />
      </Routes>
    </Router>
  );
}

export default App;
