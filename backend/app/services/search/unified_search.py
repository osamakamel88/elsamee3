import re

def detect_query_type(query: str) -> str:
    # ISRC: 2 letters, 3 alphanum, 2 digits, 5 digits
    isrc_pattern = re.compile(r'^[A-Z]{2}[A-Z0-9]{3}\d{2}\d{5}$')
    # ISWC: T-nnn.nnn.nnn-n
    iswc_pattern = re.compile(r'^T-\d{3}\.\d{3}\.\d{3}-\d$')
    url_pattern = re.compile(r'^https?://')
    
    if isrc_pattern.match(query):
        return "isrc"
    if iswc_pattern.match(query):
        return "iswc"
    if url_pattern.match(query):
        return "url"
    return "text"
