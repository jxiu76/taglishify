import torch
from transformers import pipeline

class LocalRefiner:
    def __init__(self, model_id="Qwen/Qwen2.5-1.5B-Instruct"):
        print(f"Loading local refiner model: {model_id}...")
        device = "cuda" if torch.cuda.is_available() else "cpu"
        
        # Use a lightweight pipeline
        self.pipe = pipeline(
            "text-generation",
            model=model_id,
            torch_dtype=torch.float16 if device == "cuda" else torch.float32,
            device_map="auto"
        )
        print(f"Local Refiner loaded on {device}.")

    def refine(self, system_prompt: str, raw_text: str) -> str:
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Here is the raw ASR text to refine:\n\n{raw_text}"},
        ]
        
        # Generate output
        outputs = self.pipe(
            messages,
            max_new_tokens=1024,
            do_sample=True,
            temperature=0.7,
            top_p=0.9,
        )
        
        return outputs[0]["generated_text"][-1]["content"]

# Singleton instance
_refiner_instance = None

def get_local_refiner():
    global _refiner_instance
    if _refiner_instance is None:
        _refiner_instance = LocalRefiner()
    return _refiner_instance
