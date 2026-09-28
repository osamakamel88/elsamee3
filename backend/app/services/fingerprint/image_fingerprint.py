try:
    import imagehash
except ImportError:
    imagehash = None

from PIL import Image

def _pil_average_hash(img: Image.Image) -> str:
    # 8x8 grayscale average hash
    img_gray = img.resize((8, 8), Image.Resampling.LANCZOS).convert('L')
    pixels = list(img_gray.getdata())
    avg = sum(pixels) / len(pixels) if pixels else 0
    bits = "".join("1" if p > avg else "0" for p in pixels)
    return hex(int(bits, 2))[2:].zfill(16)

def compute_phash(file_path: str) -> str:
    with Image.open(file_path) as img:
        if imagehash:
            return str(imagehash.phash(img))
        return _pil_average_hash(img)

def compute_dhash(file_path: str) -> str:
    with Image.open(file_path) as img:
        if imagehash:
            return str(imagehash.dhash(img))
        return _pil_average_hash(img)

def compute_average_hash(file_path: str) -> str:
    with Image.open(file_path) as img:
        if imagehash:
            return str(imagehash.average_hash(img))
        return _pil_average_hash(img)

def fingerprint_image(file_path: str) -> dict:
    with Image.open(file_path) as img:
        ahash = str(imagehash.average_hash(img)) if imagehash else _pil_average_hash(img)
        phash = str(imagehash.phash(img)) if imagehash else ahash
        dhash = str(imagehash.dhash(img)) if imagehash else ahash
        return {
            "phash": phash,
            "dhash": dhash,
            "ahash": ahash,
            "width": img.width,
            "height": img.height
        }
