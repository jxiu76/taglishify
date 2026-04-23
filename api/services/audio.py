import os
import ffmpeg

def extract_audio(video_path: str, audio_path: str) -> str:
    """
    Extracts a lightweight 16kHz wav file from the input video.
    """
    try:
        (
            ffmpeg
            .input(video_path)
            .output(audio_path, acodec='pcm_s16le', ac=1, ar='16k')
            .overwrite_output()
            .run(quiet=True)
        )
        return audio_path
    except ffmpeg.Error as e:
        print("FFmpeg error during extraction:", e)
        raise e
