import json
import os

from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from pypdf import PdfReader
from pydantic import BaseModel
from groq import Groq
from dotenv import load_dotenv

# Search for .env in current directory and parent directory
env_path = Path(__file__).parent / ".env"
parent_env = Path(__file__).parent.parent / ".env"
if env_path.exists():
    load_dotenv(dotenv_path=env_path)
elif parent_env.exists():
    load_dotenv(dotenv_path=parent_env)
else:
    load_dotenv()

my_api_key = os.getenv("GROQ_API_KEY")
if not my_api_key:
    raise ValueError("GROQ_API_KEY environment variable is not set.")

client = Groq(api_key=my_api_key)
model = "openai/gpt-oss-120b"

app = FastAPI(title="HireMe Candidate AI Assistant")

# Enable CORS for frontend connectivity (Vite dev server, Netlify deployments, etc.)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


#parsing resume

class Experience(BaseModel):
    company: str | None = None
    role: str | None = None
    duration: str | None = None
    description: str | None = None
    skills: list[str]=[]

class Resume(BaseModel):
    name: str | None = None
    email: str | None = None
    phone: str | None = None
    education: list[str]=[]
    experiences: list[Experience]=[]
    skills: list[str]=[]
    projects: list[str]=[]
    certifications: list[str]=[]

    total_experience_years: float | None = None
resume_schema = Resume.model_json_schema()

class ChatRequest(BaseModel):
    question: str

def ask_candidate(question: str, resume: Resume):

    system_prompt = f"""
You are an AI assistant representing a job candidate.

Below is everything you know about the candidate.

{resume.model_dump_json(indent=2)}

Rules:

1. Answer only using this information.

2. Never hallucinate.

3. If information is unavailable,
say

"I don't have enough information to answer that."

4. Be professional.

5. Answer as if HR is interviewing this candidate.

6. If asked for your resume, PDF, or contact details, provide your email/phone and mention that the full official resume PDF can be downloaded via the "Resume" button in the navigation header or candidate profile.
"""

    response = client.chat.completions.create(

        model=model,

        messages=[

            {
                "role":"system",
                "content":system_prompt
            },

            {
                "role":"user",
                "content":question
            }

        ]

    )

    return response.choices[0].message.content
def parse_resume(resume_text):
    System_prompt = f"""
    You are an expert resume parser.

    Extract information from the reusme Based on its meaning
    not only based on extracted section headings

    Different resumes may use differnet headings

    For example:
    - Experience
    - Professional Experience
    - Work History
    - Employment
    - Internships experience

    These may all contain relevant experience information. You should extract the information based on its meaning, not just the heading.

    Skills may also appear in the skills section, work experience,
    internships or projects.
    Return ONLY Valid JSON that matches the schema exactly:
    {resume_schema}

    IMPORTANT:
    1. Do NOT return the schema as it is.
    2. Do Not invent information.
    3. If a value is not available, return null
    4. If a list has no information, return an empty list.
    5. Include internships inside experiences.
    6. Extract skills from all sections, not just the skills section.
    """

    user_prompt = f"""
    Parse the following resume:
    {resume_text}
    """
    message_system={
        "role": "system",
        "content": System_prompt,
    }
    message_user={
        "role": "user",
        "content": user_prompt,
    }
    messages = [message_system, message_user]
    response_format={
        "type": "json_object",
    }
    response = client.chat.completions.create(
        model=model,
        messages=messages,
        response_format=response_format
    )
    answer = response.choices[0].message.content
    raw_output = answer
    data = json.loads(raw_output)
    resume = Resume(**data)
    return resume

#pdf extraction
def read_pdf(file_path: Path):
    reader = PdfReader(file_path)
    text = ""
    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text += page_text + "\n"
    return text

# In-memory cached resume to avoid re-parsing on every single chat message
_cached_resume = None

def get_parsed_resume() -> Resume:
    global _cached_resume
    if _cached_resume is None:
        pdf_file = Path(__file__).parent / "Sarthak_Mehrotra_Aug_2026_Resume (2).pdf"
        if not pdf_file.exists():
            raise FileNotFoundError(f"Resume PDF not found at {pdf_file}")
        resume_text = read_pdf(pdf_file)
        _cached_resume = parse_resume(resume_text)
    return _cached_resume

@app.get("/")
def home():
    return {
        "status": "online",
        "message": "HireMe AI Candidate Assistant Backend is running!",
        "model": model,
        "candidate": "Sarthak Mehrotra"
    }

@app.get("/candidate")
def candidate_profile():
    resume = get_parsed_resume()
    return resume

@app.get("/resume")
def download_resume():
    pdf_file = Path(__file__).parent / "Sarthak_Mehrotra_Aug_2026_Resume (2).pdf"
    if not pdf_file.exists():
        raise HTTPException(status_code=404, detail="Resume PDF not found on server")
    return FileResponse(
        path=pdf_file,
        filename="Sarthak_Mehrotra_Resume.pdf",
        media_type="application/pdf",
        headers={"Content-Disposition": 'attachment; filename="Sarthak_Mehrotra_Resume.pdf"'}
    )

@app.post("/chat")
def chat(request: ChatRequest):
    resume = get_parsed_resume()
    answer = ask_candidate(request.question, resume)
    return {
        "answer": answer
    }
