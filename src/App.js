
import './App.css';
import React from 'react';
import Navbar from './components/Navbar';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';


function App() {

  return (

    <Router>
    <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/reports' component={Home} />
        <Route path='/products' />
      </Routes>
  </Router>

  );
}

export default App;