import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from .tools import AI_TOOLS

load_dotenv()

llm = ChatGoogleGenerativeAI(
    model=os.getenv("GEMINI_MODEL", "gemini-2.5-flash"),
    temperature=0.2,
)
