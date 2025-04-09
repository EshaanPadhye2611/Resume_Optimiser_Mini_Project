// src/App.jsx
import React from 'react';
import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import UploadResume from './components/UploadResume'; // adjust path if needed
import Interview from './components/Mock_Interview';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/upload" element={<UploadResume />} />
        <Route path="/interview" element={<Interview/>} />
      </Routes>
    </Router>
  );
}
