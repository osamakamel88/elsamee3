import imagehash
from PIL import Image

def compute_phash(file_path: str) -> str:
    with Image.open(file_path) as img:
        return str(imagehash.phash(img))

def compute_dhash(file_path: str) -> str:
    with Image.open(file_path) as img:
        return str(imagehash.dhash(img))

def compute_average_hash(file_path: str) -> str:
    with Image.open(file_path) as img:
        return str(imagehash.average_hash(img))

def fingerprint_image(file_path: str) -> dict:
    with Image.open(file_path) as img:
        return {
            "phash": str(imagehash.phash(img)),
            "dhash": str(imagehash.dhash(img)),
            "ahash": str(imagehash.average_hash(img)),
            "width": img.width,
            "height": img.height
        }
