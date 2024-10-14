
import './styles/App.css';
import React from 'react';
import Navbar from './components/navigation/Navbar';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './ui/home/HomePage';
import Projects from './ui/projects/ProjectManager';
import ParcelManager from './ui/parcel_manager/ParcelManager';
import CompanyManager from './ui/companies/CompanyManager';
import LoginPage from './ui/login/LoginPage';
import TeamPage from './ui/team/TeamPage';
import SupportPage from './ui/support/SupportPage';
import { Navigate } from 'react-router-dom';
import RequestManager from './ui/request/RequestManager';
// import ParcelRequestManager from './ui/parcel_manager/ParcelRequestManager';

function App() {

  return (

    <Router>
      <Routes>
      <Route path="/" element={localStorage.getItem('accessToken') ? <Navigate to="/home" /> : <LoginPage />} />
        <Route path="/home" element={<><Navbar /><HomePage /></>} />
        <Route path="/projects" element={<><Navbar /><Projects /></>} />
        <Route path="/projects/:projectId" element={<><Navbar /><ParcelManager /></>} />
        <Route path="/requests" element={<><Navbar /><RequestManager /></>} />
        <Route path="/request/:requestId" element={<><Navbar /><ParcelManager /></>} />
        <Route path="/team" element={<><Navbar /><TeamPage /></>} />
        <Route path="/support" element={<><Navbar /><SupportPage /></>} />
        <Route path="/companies" element={<><Navbar /><CompanyManager /></>} />
        {/* Add the Navbar to other routes as needed */}
      </Routes>
  </Router>

  );
}

export default App;