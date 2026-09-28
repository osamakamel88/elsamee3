import subprocess
import json

def extract_chromaprint(file_path: str) -> str:
    result = subprocess.run(['fpcalc', '-json', file_path], capture_output=True, text=True)
    if result.returncode != 0:
        raise Exception("fpcalc failed: " + result.stderr)
    data = json.loads(result.stdout)
    return data.get('fingerprint')

def fingerprint_audio(file_path: str) -> dict:
    result = subprocess.run(['fpcalc', '-json', file_path], capture_output=True, text=True)
    if result.returncode != 0:
        raise Exception("fpcalc failed: " + result.stderr)
    data = json.loads(result.stdout)
    return {
        "chromaprint_hash": data.get('fingerprint'),
        "duration": data.get('duration'),
        "sample_rate": None
    }
