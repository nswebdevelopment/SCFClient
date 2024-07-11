
import './styles/App.css';
import React from 'react';
import Navbar from './components/Navbar';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Projects from './pages/ProjectManager';
import ParcelManager from './pages/ParcelManager';
import LoginPage from './pages/LoginPage';
import TeamPage from './pages/TeamPage';
import SupportPage from './pages/SupportPage';


function App() {

  return (

    <Router>
      <Routes>
      <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<><Navbar /><HomePage /></>} />
        <Route path="/projects" element={<><Navbar /><Projects /></>} />
        <Route path="/projects/:projectId" element={<><Navbar /><ParcelManager /></>} />

        <Route path="/team" element={<><Navbar /><TeamPage /></>} />
        <Route path="/support" element={<><Navbar /><SupportPage /></>} />
        {/* Add the Navbar to other routes as needed */}
      </Routes>
  </Router>

  );
}

export default App;