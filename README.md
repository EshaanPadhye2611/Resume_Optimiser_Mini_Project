🚀 Resume Optimiser

An AI-powered web platform that helps users optimize their resumes, improve ATS scores, generate personalized cover letters, and even practice mock interviews — all in one seamless experience! ✨

🔍 Features
- 📄 Resume Upload: Accepts PDF and DOCX files.
- 🤖 AI Feedback: Uses Google Gemini to deliver smart, constructive suggestions.
- ✅ ATS Score: Evaluates resume compatibility with Applicant Tracking Systems.
- ✍️ Cover Letter Generator: Automatically generates tailored cover letters.
- 🧹 Proofreading Suggestions: Refines grammar, tone, and structure.
- 🎤 Mock Interview: Practice interviews with AI-generated questions and scoring.
- 🔐 Secure Login/Signup system.

🛠 Tech Stack
Frontend: ⚛️ React.js, Tailwind CSS, AOS, React Toastify  
Backend: 🐍 FastAPI, Node.js (for auth), Joblib ML model  
AI: 🤖 Google Gemini 1.5, TF-IDF, Cosine Similarity  
Other: 📦 Selenium (for job scraping), 🌐 Vercel (Frontend), Render/Railway (Backend)

📦 How It Works
1. Upload your resume and enter the job description.
2. AI analyzes your resume, scores it, and gives feedback.
3. View ATS score, AI feedback, proofreading, and cover letter.
4. Optionally, practice a mock interview based on your resume.

🧪 Installation
Backend:
- pip install -r requirements.txt
- uvicorn main:app --reload

Frontend:
- npm install
- npm run dev

Make sure to set environment variables like GEMINI_API_KEY and VITE_MAIN_BACKEND_URL.

🌐 Hosted
Frontend: https://resume-frontend-bay.vercel.app  
Backend: (your backend host URL)

🪄 Future Improvements
- Export feedback as PDF
- Resume version tracking
- Multilingual support
- One-click resume template generator

🤝 Contribute
Open to contributions! Feel free to create a pull request or issue.

📄 License
MIT License © 2025 Eshaan Padhye

Made with ❤️ using FastAPI, React, and Gemini AI.
