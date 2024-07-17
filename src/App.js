
import './styles/App.css';
import React from 'react';
import Navbar from './components/navigation/Navbar';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './ui/home/HomePage';
import Projects from './ui/projects/ProjectManager';
import ParcelManager from './ui/parcel_manager/ParcelManager';
import LoginPage from './ui/login/LoginPage';
import TeamPage from './ui/team/TeamPage';
import SupportPage from './ui/support/SupportPage';



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