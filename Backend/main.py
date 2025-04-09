import os
import shutil
import fitz  # PyMuPDF
import docx
import re
import nltk
import time
import joblib
import PyPDF2
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from fuzzywuzzy import process
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import google.generativeai as genai

# Downloads for NLTK
nltk.download("wordnet")

# Load Gemini API key
genai.configure(api_key="AIzaSyDrM83L7WFPvgtGUB6UmVPAsurYfCTt2jw")  # Replace with your actual API key

# Load model and vectorizer
model = joblib.load("resume_classifier_model.joblib")
tfidf = joblib.load("tfidf_vectorizer.joblib")

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

SECTION_HEADERS = {
    "projects": ["projects", "academic projects", "personal projects", "research work"],
    "experience": ["experience", "work experience", "internship", "professional experience"],
    "technical_skills": ["skills", "technical skills", "tech stack", "programming skills"],
    "achievements": ["achievements", "awards", "recognition", "honors"]
}

# ----------- Resume Utilities -----------

def extract_text_from_pdf(pdf_path):
    text = ""
    doc = fitz.open(pdf_path)
    for page in doc:
        text += page.get_text()
    return text

def extract_text_from_docx(docx_path):
    doc = docx.Document(docx_path)
    return "\n".join([para.text for para in doc.paragraphs])

def extract_text(file_path):
    if file_path.endswith(".pdf"):
        return extract_text_from_pdf(file_path)
    elif file_path.endswith(".docx"):
        return extract_text_from_docx(file_path)
    return ""

def extract_details(text):
    data = {key: [] for key in SECTION_HEADERS}
    data["introduction"] = ""
    lines = text.split("\n")
    current = None
    for line in lines:
        cleaned = line.strip().lower()
        match = process.extractOne(cleaned, [kw for kws in SECTION_HEADERS.values() for kw in kws])
        if match and match[1] > 70:
            for section, kws in SECTION_HEADERS.items():
                if match[0] in kws:
                    current = section
        if current:
            data[current].append(line.strip())
    sentences = re.split(r"\.|", text)
    data["introduction"] = " ".join(sentences[:3])
    return data

def clean_resume(text):
    text = re.sub(r'\b\w{1,2}\b', '', text)
    text = re.sub(r'[^a-zA-Z]', ' ', text)
    return text.lower()

def calculate_similarity(resume_texts, job_desc):
    corpus = [job_desc] + resume_texts
    vectorizer = TfidfVectorizer(stop_words="english")
    tfidf_matrix = vectorizer.fit_transform(corpus)
    return cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:])[0]

def calculate_ats_score(job_description, resume_text):
    job_keywords = set(re.findall(r'\b\w+\b', job_description.lower()))
    resume_keywords = set(re.findall(r'\b\w+\b', resume_text.lower()))
    matched_keywords = job_keywords.intersection(resume_keywords)
    if len(job_keywords) == 0:
        return 0.0
    return len(matched_keywords) / len(job_keywords) * 100

def prompt_ai(prompt):
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        return model.generate_content(prompt).text
    except Exception as e:
        return f"AI Error: {str(e)}"

# ----------- LinkedIn Job Fetch -----------

def get_jobs_from_linkedin_multiple_queries(queries, location="Remote"):
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

    job_list = []
    for query in queries:
        try:
            search_url = f"https://www.linkedin.com/jobs/search/?keywords={query.replace(' ', '%20')}&location={location}"
            driver.get(search_url)
            time.sleep(5)
            job_elements = driver.find_elements(By.CLASS_NAME, "base-card")
            for job in job_elements[:5]:
                try:
                    title = job.find_element(By.CLASS_NAME, "base-search-card__title").text.strip()
                    company = job.find_element(By.CLASS_NAME, "base-search-card__subtitle").text.strip()
                    location = job.find_element(By.CLASS_NAME, "job-search-card__location").text.strip()
                    job_list.append({"title": title, "company": company, "location": location})
                except:
                    continue
            if job_list:
                break
        except Exception:
            continue
    driver.quit()
    return job_list if job_list else [{"title": "No jobs found", "company": "", "location": ""}]

# ----------- API Endpoint -----------

@app.post("/analyze")
async def analyze_resume(file: UploadFile = File(...), job_description: str = Form(...)):
    os.makedirs("resumes", exist_ok=True)
    path = f"resumes/{file.filename}"
    with open(path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    resume_text = extract_text(path)
    cleaned_resume = clean_resume(resume_text)
    vectorized_resume = tfidf.transform([cleaned_resume])
    prediction = model.predict(vectorized_resume)[0]
    ats_score = calculate_ats_score(job_description, cleaned_resume)
    details = extract_details(resume_text)
    similarity = calculate_similarity([resume_text], job_description)[0]

    print(f"\n📊 ATS Score for {file.filename}: {round(ats_score, 2)}%\n")

    skills = details.get("technical_skills", [])
    keywords_for_jobs = skills if skills else ["Web Developer"]
    matched_jobs = get_jobs_from_linkedin_multiple_queries(keywords_for_jobs)

    combined_prompt = f"Job Description:\n{job_description}\n\nResume Content:\n{resume_text[:3000]}"

    details.update({
        "resume_file": file.filename,
        "category": prediction,
        "ats_score": round(ats_score, 2),
        "match_score": round(similarity * 100, 2),
        "final_score": round(len(details["experience"]) * 0.4 + len(details["technical_skills"]) * 0.3 + len(details["projects"]) * 0.2 + 0.1, 2),
        "cover_letter": prompt_ai(f"Write a cover letter based on the following:\n{combined_prompt}"),
        "proofreading": prompt_ai(f"Proofread this resume considering the job:\n{combined_prompt}"),
        "ai_feedback": prompt_ai(f"Give constructive and detailed feedback for improving this resume for the job:\n{combined_prompt}"),
        "linkedin_jobs": matched_jobs
    })

    return details
