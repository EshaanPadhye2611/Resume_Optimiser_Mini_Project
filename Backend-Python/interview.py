from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("models/gemini-1.5-flash")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/")
def read_root():
    return {"message": "Welcome to the interview Python backend!"}

@app.post("/generate_question")
def generate_question():
    return {"question": "What are your strengths and weaknesses?"}

used_questions = set()

class ResumeContext(BaseModel):
    resume_context: str

class AnswerData(BaseModel):
    question: str
    answer: str

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

    Avoid common/generic questions and produce ONLY the raw question.

    Resume Content:
    {data.resume_context}
    """
    try:
        max_attempts = 5
        for _ in range(max_attempts):
            response = model.generate_content(prompt)
            raw_q = response.text.strip().replace('"', '').replace("'", "").strip()

            if raw_q and raw_q not in used_questions:
                used_questions.add(raw_q)
                if len(used_questions) > 100:
                    used_questions.clear()
                return {"question": raw_q}
        return {"question": "Describe a unique challenge from your resume and how you solved it."}
    except Exception as e:
        print("Gemini error (interview_question):", e)
        return {"question": "Tell me about a time you overcame a major obstacle in your work."}


@app.post("/evaluate_answer", response_class=HTMLResponse)
async def evaluate_answer(data: AnswerData):
    """
    This endpoint returns a single, clean HTML snippet:
      - No triple backticks.
      - Bold headings for "Interview Feedback", "Feedback:", and "Score Breakdown".
      - Bold labels for each score line.

    The snippet is well-formed with no code fences or extra quotes.
    """
    prompt = f"""
    You are an AI interviewer evaluating this candidate's answer:

    Question: {data.question}
    Answer: {data.answer}

    Please produce one well-formed HTML snippet that includes:
      1. <h2><strong>Interview Feedback</strong></h2>
      2. A line with <strong>Feedback:</strong> followed by your feedback in plain text.
      3. A line or subheading <strong>Score Breakdown</strong>, followed by bullet points:
         <li><strong>Clarity:</strong> X/10</li>
         <li><strong>Relevance:</strong> X/10</li>
         <li><strong>Structure:</strong> X/10</li>
         <li><strong>Confidence:</strong> X/10</li>
         <li><strong>Keyword Usage:</strong> X/10</li>
    NO triple backticks, NO code blocks, NO "```html" fences.

    Output just the snippet in a single <div>.
    """
    try:
        response = model.generate_content(prompt)
        html_snippet = response.text.strip()
        # Just return the snippet (no backticks).
        return html_snippet
    except Exception as e:
        print("Gemini error (evaluate_answer):", e)
        return (
            "<div>"
            "<h2><strong>Interview Feedback</strong></h2>"
            "<p><strong>Feedback:</strong> An error occurred.</p>"
            "</div>"
        )
