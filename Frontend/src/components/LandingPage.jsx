// src/pages/LandingPage.jsx
import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

import 'aos/dist/aos.css';
import {
  FaRobot,
  FaFileAlt,
  FaWrench,
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaTimes,
  FaEnvelope,
  FaLock,
  FaUser,
  FaRocket,
} from 'react-icons/fa';
import axios from 'axios';

const LandingPage = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);
const navigate = useNavigate();

  const [showPopup, setShowPopup] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";
  
    try {
      const response = await axios.post(endpoint, formData);
      console.log(response); // Debugging
  
      if (isLogin) {
        const { token, user } = response.data;
  
        // Store token and user name
        localStorage.setItem('token', token);
        localStorage.setItem('username', user?.name || '');
  
        toast.success('Login successful!');
        setShowPopup(false);
        setError('');
        setTimeout(() => navigate('/upload'), 1500);
      } else {
        toast.success('Account created! Please log in.');
        setIsLogin(true);
        setFormData({ name: '', email: '', password: '' });
      }
  
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong';
      setError(msg);
      toast.error(msg);
    }
  };
  
  
  return (
    <div className="bg-gradient-to-br from-indigo-100 to-violet-200 text-gray-800 font-sans relative overflow-hidden">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-700 to-indigo-600 text-white py-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center px-6">
          <h1 className="text-3xl font-bold flex items-center gap-2 ml-4">
            <FaRocket className="text-white" /> Resume Optimiser
          </h1>
          <nav className="space-x-6">
            <a href="#features" className="hover:underline">Features</a>
            <a href="#about" className="hover:underline">About</a>
            <a href="#contact" className="hover:underline">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
        <h2 data-aos="fade-up" className="text-5xl font-bold text-indigo-700 mb-4">
          Optimize Your Resume Instantly
        </h2>
        <p data-aos="fade-up" data-aos-delay="200" className="text-lg text-gray-600 max-w-xl">
          Leverage AI to enhance your resume, beat applicant tracking systems, and land your dream job faster.
        </p>
        <img
          src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          alt="Resume"
          className="w-72 mt-10"
          data-aos="zoom-in"
          data-aos-delay="400"
        />
        <div className="mt-8 flex gap-4">
          <button
            onClick={() => setShowPopup(true)}
            className="px-6 py-3 bg-indigo-700 text-white font-semibold rounded-xl hover:bg-indigo-800 transition"
          >
            Get Started
          </button>
          <button
            onClick={() => setShowInfo(true)}
            className="px-6 py-3 border border-indigo-600 text-indigo-700 font-semibold rounded-xl hover:bg-indigo-100 transition"
          >
            Learn More
          </button>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6" >
        <h3 className="text-3xl font-bold text-center text-indigo-700 mb-12">Features</h3>
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <div className="p-6 border rounded-xl shadow hover:shadow-lg transition" data-aos="flip-left">
            <FaRobot className="text-indigo-600 text-4xl mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-center">AI Resume Feedback</h4>
            <p className="text-center text-gray-600 mt-2">Smart suggestions to improve your resume instantly.</p>
          </div>
          <div className="p-6 border rounded-xl shadow hover:shadow-lg transition" data-aos="flip-up" data-aos-delay="100">
            <FaFileAlt className="text-indigo-600 text-4xl mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-center">Professional Templates</h4>
            <p className="text-center text-gray-600 mt-2">Modern, ATS-friendly designs to choose from.</p>
          </div>
          <div className="p-6 border rounded-xl shadow hover:shadow-lg transition" data-aos="flip-right" data-aos-delay="200">
            <FaWrench className="text-indigo-600 text-4xl mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-center">Job-based Customization</h4>
            <p className="text-center text-gray-600 mt-2">Customize resumes with keywords for each job.</p>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 px-6 bg-indigo-50">
        <div className="max-w-4xl mx-auto text-center" data-aos="fade-in">
          <h3 className="text-3xl font-bold text-indigo-700 mb-6">About Us</h3>
          <p className="text-gray-700 text-lg">
            Resume Optimiser is built to help job seekers craft the perfect resume using the power of AI.
            Whether you're a student, professional, or career switcher — our platform is tailored to guide and
            enhance your resume journey.
          </p>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 px-6">
        <div className="max-w-xl mx-auto text-center" data-aos="zoom-in">
          <h3 className="text-3xl font-bold text-indigo-700 mb-6">Get in Touch</h3>
          <p className="text-gray-600 mb-4">
            Email us at <a href="mailto:support@resumeoptimiser.ai" className="text-indigo-600 font-medium">support@resumeoptimiser.ai</a>
          </p>
          <div className="flex justify-center gap-6 text-indigo-600 text-2xl">
            <a href="#" aria-label="LinkedIn"><FaLinkedin /></a>
            <a href="#" aria-label="Twitter"><FaTwitter /></a>
            <a href="#" aria-label="Instagram"><FaInstagram /></a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-indigo-700 text-white py-6 text-center">
        <p>&copy; {new Date().getFullYear()} Resume Optimiser. All rights reserved.</p>
      </footer>

      {/* Login / Signup Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition text-xl"
            >
              X
            </button>
            <h2 className="text-2xl font-bold text-indigo-700 text-center mb-6">
              {isLogin ? 'Login to Your Account' : 'Create a New Account'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
  {!isLogin && (
    <div className="relative">
      <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={formData.name}
        onChange={handleInputChange}
        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
      />
    </div>
  )}

  <div className="relative">
    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
    <input
      type="email"
      name="email"
      placeholder="Email"
      value={formData.email}
      onChange={handleInputChange}
      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
    />
  </div>

  <div className="relative">
    <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
    <input
      type="password"
      name="password"
      placeholder="Password"
      value={formData.password}
      onChange={handleInputChange}
      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
    />
  </div>

  {error && <p className="text-red-500 text-sm">{error}</p>}

  <button
    type="submit"
    className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition flex items-center justify-center gap-2"
  >
    {isLogin ? <FaLock /> : <FaUser />} {isLogin ? 'Login' : 'Sign Up'}
  </button>

  <p className="text-sm text-center text-gray-600">
    {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
    <button
      type="button"
      className="text-indigo-600 hover:underline font-medium"
      onClick={() => setIsLogin(!isLogin)}
    >
      {isLogin ? 'Sign Up' : 'Login'}
    </button>
  </p>
</form>
          </div>
        </div>
      )}
    

      {/* Learn More Info Popup */}
      {showInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div data-aos="fade-up" className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-3xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowInfo(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition text-xl"
            >
              <FaTimes />
            </button>
            <h2 className="text-2xl font-bold text-indigo-700 text-center mb-4">How Resume Optimiser Works</h2>
            <ul className="list-disc text-gray-700 pl-6 space-y-2 text-base">
              <li>Upload or paste your existing resume into our AI platform.</li>
              <li>Our intelligent parser extracts relevant sections and keywords.</li>
              <li>The system analyzes your resume using job-matching algorithms.</li>
              <li>AI compares your resume with thousands of job descriptions.</li>
              <li>Identifies missing skills, weak phrases, and formatting issues.</li>
              <li>Generates real-time suggestions to improve grammar and tone.</li>
              <li>Recommends keywords to match your resume with specific job roles.</li>
              <li>Highlights ATS (Applicant Tracking System) compatibility issues.</li>
              <li>Allows one-click optimization for each section: Summary, Skills, Experience.</li>
              <li>Offers multiple resume templates with drag-and-drop editing.</li>
              <li>Ensures layout stays professional and readable on any device.</li>
              <li>Personalizes suggestions for your industry and job level.</li>
              <li>Provides action words and metrics to improve impact.</li>
              <li>Shows a resume score based on strength, keywords, and formatting.</li>
              <li>Enables side-by-side before/after comparison of edits.</li>
              <li>Tracks edits for undo/redo and version control.</li>
              <li>Gives feedback based on your career goals and experience.</li>
              <li>Offers export to PDF, DOCX, and LinkedIn formats.</li>
              <li>All your data is encrypted and stored securely.</li>
              <li>No login required for basic features. Sign up for premium options.</li>
              <li>100% mobile responsive design.</li>
              <li>Integrated with LinkedIn, Google Drive, and GitHub for import/export.</li>
              <li>AI learns from your job interests and customizes tips over time.</li>
              <li>Built for students, freshers, professionals, and career switchers.</li>
              <li>Completely free for core features. Premium unlocks deep customization.</li>
              <li>Live resume preview updates in real-time as you edit.</li>
              <li>Dark mode support for comfortable editing at night.</li>
              <li>Simple onboarding — start editing in seconds.</li>
              <li>Built with React, Tailwind CSS, and AI APIs.</li>
            </ul>
          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={3000} />

    </div>
  );
};

export default LandingPage;
