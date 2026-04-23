import os
import google.generativeai as genai

# Read key from local env variable
API_KEY = os.environ.get("GEMINI_API_KEY", "YOUR_API_KEY_HERE")
genai.configure(api_key=API_KEY)

# Use Gemini 1.5 Flash for fast Taglish-English contextual understanding
model = genai.GenerativeModel("gemini-1.5-flash")

SYSTEM_PROMPT = """You are an expert Tagalog Linguist, Subtitle Editor, and Taglish Specialist.
Your task is to cleanly format Whisper ASR text into professional Taglish subtitles.
Handle sentences containing both Tagalog and English naturally. Do NOT force-translate to pure Tagalog or English. Preserve the colloquial "vibe."

CRITICAL RULES:
1. Max 1-2 lines per segment.
2. STRICT LIMIT: <= 42 characters per line.
3. Split text at natural pauses; avoid awkward phrase breaks.

OUTPUT STRICTLY IN THIS FORMAT:
[Segment X]
<Tagalog/Taglish line 1>
<Tagalog/Taglish line 2>
[English Translation]
"""

def refine_transcription(raw_text: str) -> str:
    """
    Sends the raw Whisper ASR dump to Gemini 1.5 Flash for refinement.
    """
    prompt = f"{SYSTEM_PROMPT}\n\nHere is the raw ASR text to refine:\n\n{raw_text}"
    
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print("Gemini Generation Error:", e)
        return str(e)
