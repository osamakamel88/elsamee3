import re
from typing import List, Set

# Common Arabic-English transliteration phonetic equivalences
TRANSLITERATION_MAP = {
    "basem": ["bassem", "باسم"],
    "bassem": ["basem", "باسم"],
    "باسم": ["bassem", "basem"],
    "adel": ["adil", "aadil", "عادل"],
    "عادل": ["adel", "adil"],
    "mohamed": ["mohammed", "muhamed", "muhammad", "محمد"],
    "mohammed": ["mohamed", "muhammad", "محمد"],
    "محمد": ["mohamed", "mohammed"],
    "nadi": ["elnadi", "el nadi", "al nadi", "النادي"],
    "yehia": ["yahya", "yehya", "يحيى"],
    "hassan": ["hasan", "حسن"],
    "said": ["saeed", "sayed", "سعيد"],
}

def expand_query_variants(query: str) -> List[str]:
    """
    Generate spelling variants and Arabic/English equivalents for names,
    e.g., 'basem adel' -> ['basem adel', 'bassem adel', 'باسم عادل']
    """
    q = query.strip()
    if not q:
        return []

    variants: Set[str] = {q}
    words = q.lower().split()

    # Generate double-s/single-s variations
    if "ss" in q.lower():
        variants.add(re.sub(r'ss+', 's', q, flags=re.IGNORECASE))
    elif "s" in q.lower():
        variants.add(re.sub(r's+', 'ss', q, flags=re.IGNORECASE))

    # Substitute known words
    expanded_word_lists = []
    for word in words:
        mapped = TRANSLITERATION_MAP.get(word, [])
        expanded_word_lists.append([word] + mapped)

    # Simple 2-word combination if 2 words
    if len(words) == 2:
        list1 = expanded_word_lists[0]
        list2 = expanded_word_lists[1]
        for w1 in list1:
            for w2 in list2:
                variants.add(f"{w1} {w2}".strip())

    return list(variants)
