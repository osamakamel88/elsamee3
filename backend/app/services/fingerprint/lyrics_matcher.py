import re
import hashlib
from typing import Dict, Any, List

def normalize_arabic_text(text: str) -> str:
    """Normalize Arabic text by removing tashkeel, standardizing letters, and cleaning punctuation."""
    if not text:
        return ""
    
    # 1. Remove Tashkeel (diacritics: fatha, damma, kasra, sukun, shadda, tanween)
    tashkeel_pattern = re.compile(r'[\u0617-\u061A\u064B-\u0652]')
    text = re.sub(tashkeel_pattern, '', text)
    
    # 2. Remove Tatweel (Kashida _)
    text = re.sub(r'\u0640', '', text)
    
    # 3. Normalize Alef variants (أ, إ, آ -> ا)
    text = re.sub(r'[إأآا]', 'ا', text)
    
    # 4. Normalize Yaa and Alif Maqsura (ى -> ي)
    text = re.sub(r'ى', 'ي', text)
    
    # 5. Normalize Taa Marbouta (ة -> ه)
    text = re.sub(r'ة', 'ه', text)
    
    # 6. Normalize Whitespace and lowercase English
    text = re.sub(r'\s+', ' ', text).strip().lower()
    return text

def compute_lyrics_fingerprint(lyrics: str) -> Dict[str, Any]:
    """Generate cryptographic and structural fingerprints for lyrics/poetry."""
    normalized = normalize_arabic_text(lyrics)
    
    # Cryptographic hash of normalized text for exact anteriority proof
    crypto_hash = hashlib.sha256(normalized.encode('utf-8')).hexdigest()
    
    # Word tokens
    words = normalized.split()
    total_words = len(words)
    unique_words = len(set(words))
    
    # Extract 3-gram word shingles for fuzzy partial match
    shingles = set()
    if total_words >= 3:
        for i in range(total_words - 2):
            shingles.add(" ".join(words[i:i+3]))
            
    return {
        "text_hash": crypto_hash,
        "word_count": total_words,
        "unique_word_count": unique_words,
        "shingle_count": len(shingles),
        "normalized_preview": normalized[:150] + ("..." if len(normalized) > 150 else "")
    }

def calculate_lyrics_similarity(lyrics_a: str, lyrics_b: str) -> float:
    """Calculate similarity percentage (0.0 to 1.0) between two lyric excerpts."""
    norm_a = normalize_arabic_text(lyrics_a)
    norm_b = normalize_arabic_text(lyrics_b)
    
    if not norm_a or not norm_b:
        return 0.0
    
    if norm_a == norm_b:
        return 1.0
        
    words_a = set(norm_a.split())
    words_b = set(norm_b.split())
    
    # Jaccard word similarity
    intersection = words_a.intersection(words_b)
    union = words_a.union(words_b)
    
    if not union:
        return 0.0
        
    jaccard = len(intersection) / len(union)
    
    # Check substring containment (e.g. A stolen chorus inside a longer song)
    if norm_a in norm_b or norm_b in norm_a:
        jaccard = max(jaccard, 0.85)
        
    return round(jaccard, 3)
