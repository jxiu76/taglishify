from services.local_refiner import get_local_refiner

SYSTEM_PROMPT = """You are an expert Tagalog Linguist, Subtitle Editor, and Taglish Specialist.
Your task is to cleanly format Whisper ASR text into professional Taglish subtitles while PRESERVING timestamps.
Handle sentences containing both Tagalog and English naturally. Do NOT force-translate to pure Tagalog or English. Preserve the colloquial "vibe."

CRITICAL RULES:
1. Max 1-2 lines per segment.
2. STRICT LIMIT: <= 42 characters per line.
3. Split text at natural pauses; avoid awkward phrase breaks.
4. DO NOT remove or modify the timestamp (e.g., [0.00s - 1.20s]). Keep it at the start of each segment.

OUTPUT STRICTLY IN THIS FORMAT:
[<TIMESTAMP>]
<Tagalog/Taglish line 1>
<Tagalog/Taglish line 2>
[English Translation]
"""

def refine_transcription(raw_segments: list) -> str:
    """
    Sends Whisper ASR chunks to the local LLM in batches.
    """
    if not raw_segments:
        return ""

    refiner = get_local_refiner()
    refined_output = []
    
    # Process in chunks of 10 segments for speed and reliability
    chunk_size = 10
    chunks = [raw_segments[i:i + chunk_size] for i in range(0, len(raw_segments), chunk_size)]
    
    print(f"\n--- Refining {len(raw_segments)} segments in {len(chunks)} batches ---", flush=True)
    
    try:
        for i, chunk in enumerate(chunks):
            print(f"  Batch {i+1}/{len(chunks)} refining...", end=" ", flush=True)
            chunk_text = "\n".join(chunk)
            refined_chunk = refiner.refine(SYSTEM_PROMPT, chunk_text)
            refined_output.append(refined_chunk)
            print("Done.", flush=True)
            
        return "\n\n".join(refined_output)
    except Exception as e:
        print(f"\nLocal Refiner Error during batch processing: {e}", flush=True)
        return "\n".join(raw_segments) # Fallback to raw if logic fails
