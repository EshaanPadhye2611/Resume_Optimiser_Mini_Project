from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
import json
import random

# ✅ Configure Gemini
genai.configure(api_key="AIzaSyDrM83L7WFPvgtGUB6UmVPAsurYfCTt2jw")
model = genai.GenerativeModel("models/gemini-1.5-flash")

app = FastAPI()

# ✅ Allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory history of questions to minimize repetition (for basic protection)
used_questions = set()

# ✅ Request schemas
class ResumeContext(BaseModel):
    resume_context: str

class AnswerData(BaseModel):
    question: str
    answer: str

# ✅ Generate diverse and non-repeating interview question
@app.post("/interview_question")
async def interview_question(data: ResumeContext):
    prompt = f"""
    You are an AI interviewer.

    Based on the resume below, generate ONE unique interview question.
    
    Choose randomly from one of these types:
    - Technical (skills, projects)
    - Behavioral (teamwork, failure, conflict)
    - HR (career goals, motivation)
    - Aptitude (logical, numerical)
    - Situational (what would you do if...)

    ❗ VERY IMPORTANT:
    - Do NOT repeat commonly seen or generic questions
    - Avoid questions like: "Tell me about yourself", "Your strengths", etc.
    - Make it fresh, creative, resume-aware, and specific
    - Return only the raw question (no label, no quotes)

    Resume Content:
    {data.resume_context}
    """

    try:
        max_attempts = 5
        for _ in range(max_attempts):
            response = model.generate_content(prompt)
            question = response.text.strip().replace("'", "").replace("\"", "").strip()

            if question not in used_questions:
                used_questions.add(question)
                if len(used_questions) > 100:
                    used_questions.clear()  # reset after 100 for freshness
                return {"question": question}

        return {"question": "Describe a unique challenge from your resume and how you solved it."}
    except Exception as e:
        print("Gemini error (interview_question):", e)
        return {"question": "Tell me about a time you overcame a major obstacle in your work."}
