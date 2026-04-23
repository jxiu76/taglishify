from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import shutil
import psutil

from services.audio import extract_audio
from services.transcriber import run_transcription

app = FastAPI(title="Taglishify API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

WORKSPACE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(WORKSPACE_DIR, "uploads")
TEMP_DIR = os.path.join(WORKSPACE_DIR, "temp")

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(TEMP_DIR, exist_ok=True)

@app.get("/")
def read_root():
    return {"status": "ok", "app": "Taglishify Backend Running"}

@app.get("/system-monitor")
def system_monitor():
    return {
        "cpu": psutil.cpu_percent(interval=None),
        "ram": psutil.virtual_memory().percent,
        "gpu": 0
    }

@app.post("/upload")
async def upload_video(file: UploadFile = File(...)):
    if not file:
        raise HTTPException(status_code=400, detail="No file sent")
        
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    return {"message": "File uploaded successfully", "filename": file.filename, "path": file_path}

@app.post("/process")
async def process_video(filename: str = Form(...)):
    """
    Main orchestration endpoint.
    1. Extracts audio via FFmpeg
    2. Runs Whisper local offline ASR
    3. Runs Gemini Refiner for Taglishification
    """
    video_path = os.path.join(UPLOAD_DIR, filename)
    if not os.path.exists(video_path):
        raise HTTPException(status_code=404, detail="File not found")
        
    audio_path = os.path.join(TEMP_DIR, f"{filename}.wav")
    
    try:
        # Step 1: Extract Audio
        print(f"\n--- [1/3] Extracting Audio: {filename} ---", flush=True)
        extract_audio(video_path, audio_path)
        print("    OK: Audio extracted to temp storage.", flush=True)
        
        # Step 2: Transcribe
        print("--- [2/3] Running faster-whisper (local machine) ---", flush=True)
        raw_segments = run_transcription(audio_path)
        print(f"    OK: Transcribed {len(raw_segments)} segments.", flush=True)
        
        raw_text_joined = "\n".join(raw_segments)
        
        print("\n--- PROCESS COMPLETE ---\n", flush=True)
        
        return {
            "status": "success",
            "raw_asr": raw_text_joined,
            "refined_subtitles": raw_text_joined
        }
    except Exception as e:
        import traceback
        print("\n=== ERROR TRACEBACK ===")
        print(traceback.format_exc())
        print("=======================\n")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(audio_path):
            os.remove(audio_path)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
