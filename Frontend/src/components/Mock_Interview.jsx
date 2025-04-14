import React, { useEffect, useRef, useState } from 'react';
import {
  FaMicrophone,
  FaKeyboard,
  FaRobot,
  FaCamera,
  FaVideoSlash,
  FaVideo,
  FaPlay
} from 'react-icons/fa';
import { ImSpinner8 } from 'react-icons/im';
import axios from 'axios';

const Interview = () => {
  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const [mode, setMode] = useState('voice');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [cameraOn, setCameraOn] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setupCamera();
    fetchGeminiQuestion();
  }, []);

  const setupCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false,
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Camera error:', err.name, err.message);
      alert('Camera failed to load. Please allow permissions or check your device.');
    }
  };

  const toggleCamera = () => {
    if (cameraOn) {
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
      if (videoRef.current) videoRef.current.srcObject = null;
    } else {
      setupCamera();
    }
    setCameraOn(!cameraOn);
  };

  const fetchGeminiQuestion = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/interview_question`, // Use the environment variable
        {
          resume_context: localStorage.getItem('resume_text') || '',
        }
      );
      setQuestion(res.data.question);
    } catch (err) {
      console.error('Question fetch error:', err.message);
      setQuestion('Describe a challenging project you’ve worked on.');
    }
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setAnswer(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
    };
  };

  const handleSubmit = async () => {
    setLoading(true);
    setFeedback(null);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/evaluate_answer`, // Use the environment variable
        { question, answer },
        { responseType: 'text' }
      );
      setFeedback(res.data);
    } catch (err) {
      console.error('Evaluation error', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-white to-indigo-100">
      <h2 className="text-3xl font-bold text-indigo-700 mb-4 flex items-center gap-2">
        <FaCamera /> Mock Interview Practice
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Video Section */}
        <div className="relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="rounded-xl border shadow-md w-full h-96 object-cover bg-black"
          ></video>
          <button
            onClick={toggleCamera}
            className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-white shadow px-4 py-2 rounded-full flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            {cameraOn ? (
              <>
                <FaVideoSlash /> Camera Off
              </>
            ) : (
              <>
                <FaVideo /> Camera On
              </>
            )}
          </button>
        </div>

        {/* Question & Answer Section */}
        <div className="space-y-4">
          <div className="p-4 bg-white rounded-xl shadow">
            <h4 className="text-lg font-semibold mb-2 text-indigo-700 flex gap-2 items-center">
              <FaRobot /> Question
            </h4>
            <p className="text-gray-800 mb-4">{question}</p>
            <button
              onClick={() => speak(question)}
              className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm hover:bg-indigo-200 flex items-center gap-2"
            >
              <FaPlay /> Read Aloud
            </button>
            <div className="flex gap-4 flex-wrap mt-4">
              <button
                onClick={() => setMode('voice')}
                className={`px-4 py-2 rounded ${
                  mode === 'voice' ? 'bg-indigo-600 text-white' : 'bg-gray-100'
                }`}
              >
                <FaMicrophone /> Voice
              </button>
              <button
                onClick={() => setMode('text')}
                className={`px-4 py-2 rounded ${
                  mode === 'text' ? 'bg-indigo-600 text-white' : 'bg-gray-100'
                }`}
              >
                <FaKeyboard /> Text
              </button>
              <button
                onClick={fetchGeminiQuestion}
                className="ml-auto text-indigo-500 hover:underline"
              >
                Next Question
              </button>
            </div>
          </div>

          <div className="p-4 bg-white rounded-xl shadow">
            <h4 className="text-lg font-semibold mb-2 text-indigo-700">Your Answer</h4>
            {mode === 'voice' ? (
              <button
                onClick={startListening}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                🎤 Start Speaking
              </button>
            ) : (
              <textarea
                rows="4"
                className="w-full border border-indigo-300 rounded-lg p-2"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here..."
              ></textarea>
            )}
            <button
              onClick={handleSubmit}
              className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              Submit Answer
            </button>
          </div>
        </div>
      </div>

      {/* Loader */}
      {loading && (
        <div className="flex flex-col items-center mt-10 text-indigo-700 animate-pulse">
          <ImSpinner8 className="text-4xl animate-spin mb-2" />
          <span className="text-lg font-medium">Analyzing your response...</span>
        </div>
      )}

      {/* Feedback & Score (HTML) */}
      {feedback && !loading && (
        <div
          className="mt-8 p-6 bg-white rounded-xl shadow-lg"
          // Renders the HTML snippet we got from the server
          dangerouslySetInnerHTML={{ __html: feedback }}
        />
      )}
    </div>
  );
};

export default Interview;
