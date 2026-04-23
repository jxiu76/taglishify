from faster_whisper import WhisperModel
import os

# Initialize whisper at module level to keep it loaded continuously 
# Using "large-v3" which maps well to modern turbos in faster-whisper.
MODEL_SIZE = "large-v3"

try:
    # Attempt to load model on CUDA first
    model = WhisperModel(MODEL_SIZE, device="cuda", compute_type="float16")
    print(f"Loaded {MODEL_SIZE} on CUDA (float16)")
except Exception as e:
    print(f"CUDA failed or unavailable. Falling back to CPU. ({e})")
    model = WhisperModel(MODEL_SIZE, device="cpu", compute_type="int8")

def run_transcription(audio_path: str):
    """
    Runs the faster-whisper local engine and returns the text chunks.
    """
    # vad_filter stops hallucinations in silence periods.
    # condition_on_previous_text=False prevents repetitive "sticky" loops.
    segments, info = model.transcribe(
        audio_path, 
        beam_size=5, 
        vad_filter=True,
        condition_on_previous_text=False
    )
    
    # We will accumulate the raw text for the refiner LLM
    text_buffer = []
    
    for segment in segments:
        segment_text = f"[{segment.start:.2f}s - {segment.end:.2f}s]: {segment.text}"
        print(f"  > {segment_text}", flush=True) # Immediate terminal feedback
        text_buffer.append(segment_text)
        
    return text_buffer
