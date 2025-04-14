import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'aos/dist/aos.css';
import 'react-toastify/dist/ReactToastify.css';
import {
  FaUpload, FaFilePdf, FaCheckCircle,
  FaUserCircle, FaSignOutAlt, FaRocket, FaEnvelopeOpenText, FaLink
} from 'react-icons/fa';
import { ImSpinner8 } from 'react-icons/im';

// Utility to format text: Convert **bold** syntax to <b> tags
const formatText = (text) => {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
    .replace(/\*/g, "");
};

const UploadResume = () => {
  const [file, setFile] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('feedback');
  const [jobDescription, setJobDescription] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000 });
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) setUsername(storedUsername);
  }, []);

  const handleFile = async (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      const formData = new FormData();
      formData.append("file", uploadedFile);
      formData.append("job_description", jobDescription);

      setLoading(true);
      setFeedback(null);
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/analyze`,
          formData
        );
        setFeedback(res.data);
        toast.success("Resume analyzed!");
        setView('feedback');
      } catch {
        toast.error("Upload failed.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out");
    setTimeout(() => navigate("/"), 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-violet-200 text-gray-800">
      {/* Header */}
      <header className="bg-indigo-600 text-white py-4 shadow-md">
        <div className="container mx-auto flex flex-col sm:flex-row items-center px-6">
          <div className="flex items-center gap-2 text-2xl font-bold">
            <FaRocket /> Resume Optimiser
          </div>
          <div className="mt-2 sm:mt-0 ml-auto flex items-center gap-4">
            <FaUserCircle className="text-2xl" />
            <span className="font-medium">{username || 'Guest'}</span>
            {username && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                <FaSignOutAlt /> Logout
              </button>
            )}
            <button
              onClick={() => navigate('/interview')}
              className="px-4 py-2 rounded-lg font-semibold bg-purple-600 text-white hover:bg-purple-700 transition"
            >
              Mock Interview
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-col items-center justify-center px-4 py-10">
        <h2 className="text-3xl sm:text-4xl font-bold text-indigo-700 mb-4" data-aos="fade-up">
          Upload Your Resume
        </h2>
        <p className="text-base sm:text-lg text-center mb-8 max-w-xl" data-aos="fade-up" data-aos-delay="100">
          Upload a resume (PDF or DOCX) and receive AI feedback tailored to your target job.
        </p>

        {/* Job description input */}
        <textarea
          className="border-2 border-indigo-400 rounded-lg p-4 w-full max-w-xl mb-6"
          rows="4"
          placeholder="Enter the job description for analysis..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        ></textarea>

        {/* File upload area */}
        <label
          htmlFor="resume"
          className="border-4 border-dashed border-indigo-400 rounded-xl p-12 w-full max-w-xl text-center cursor-pointer hover:bg-indigo-50 transition"
          data-aos="zoom-in"
        >
          <div className="flex flex-col items-center gap-3">
            <FaUpload className="text-4xl text-indigo-600" />
            <p className="font-semibold text-indigo-700">Click or Drop Resume Here</p>
            <p className="text-sm text-gray-500">PDF or DOCX only</p>
          </div>
          <input id="resume" type="file" accept=".pdf,.doc,.docx" onChange={handleFile} className="hidden" />
        </label>

        {file && (
          <div className="mt-6 flex items-center gap-4">
            <FaFilePdf className="text-2xl text-red-500" />
            <span className="font-medium">{file.name}</span>
          </div>
        )}

        {loading && (
          <div className="mt-10 flex flex-col items-center gap-2 animate-pulse">
            <ImSpinner8 className="text-indigo-600 text-3xl animate-spin" />
            <span className="text-indigo-700 font-semibold">Analyzing Resume...</span>
          </div>
        )}

        {feedback && (
          <div className="mt-10 w-full max-w-3xl space-y-4">
            {/* View selector */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-4">
              {['feedback', 'proofreading', 'cover_letter', 'jobs'].map((type) => (
                <button
                  key={type}
                  onClick={() => setView(type)}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    view === type
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white border border-indigo-600 text-indigo-600 hover:bg-indigo-50'
                  }`}
                >
                  {type.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                </button>
              ))}
            </div>

            <div className="bg-white shadow-md rounded-lg p-6 space-y-4" data-aos="fade-up">
              {view === 'feedback' && (
                <>
                  <h3 className="text-xl font-bold text-indigo-700 flex items-center gap-2">
                    <FaCheckCircle className="text-green-500" /> ATS Score
                  </h3>
                  {/* ATS Progress Bar */}
                  <div className="w-full">
                    <div className="text-sm font-medium text-gray-600 mb-1">Your resume's ATS compatibility</div>
                    <div className="w-full bg-indigo-100 rounded-full h-5 overflow-hidden mb-2">
                      <div
                        className="h-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold transition-all duration-500"
                        style={{ width: `${feedback.ats_score || 0}%` }}
                      >
                        {feedback.ats_score || 0}%
                      </div>
                    </div>
                  </div>
                  {/* AI Feedback */}
                  <div
                    className="text-gray-700 text-sm whitespace-pre-line"
                    dangerouslySetInnerHTML={{ __html: formatText(feedback.ai_feedback) }}
                  ></div>
                </>
              )}

              {view === 'proofreading' && (
                <>
                  <h3 className="text-xl font-bold text-indigo-700 flex items-center gap-2">
                    <FaCheckCircle className="text-green-500" /> Proofreading Suggestions
                  </h3>
                  <div
                    className="text-gray-700 text-sm whitespace-pre-line"
                    dangerouslySetInnerHTML={{ __html: formatText(feedback.proofreading) }}
                  ></div>
                </>
              )}

              {view === 'cover_letter' && (
                <>
                  <h3 className="text-xl font-bold text-indigo-700 flex items-center gap-2">
                    <FaEnvelopeOpenText className="text-indigo-500" /> Cover Letter
                  </h3>
                  <div
                    className="text-gray-700 text-sm whitespace-pre-line"
                    dangerouslySetInnerHTML={{ __html: formatText(feedback.cover_letter) }}
                  ></div>
                </>
              )}

              {view === 'jobs' && (
                <>
                  <h3 className="text-xl font-bold text-indigo-700 flex items-center gap-2">
                    <FaLink className="text-indigo-500" /> Matching Jobs on LinkedIn
                  </h3>
                  <ul className="list-disc pl-6 mt-2 text-gray-700 text-sm">
                    {feedback.linkedin_jobs?.length > 0 &&
                    feedback.linkedin_jobs[0].title !== "No jobs found" ? (
                      feedback.linkedin_jobs.map((job, index) => (
                        <li key={index} className="mb-2">
                          <a
                            href={`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(
                              job.title
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:underline"
                          >
                            {job.title} at {job.company} ({job.location})
                          </a>
                        </li>
                      ))
                    ) : (
                      <p className="text-gray-600">No jobs found. Try refining your skills or keywords.</p>
                    )}
                  </ul>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default UploadResume;
