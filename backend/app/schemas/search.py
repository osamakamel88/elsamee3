from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from enum import Enum

class SearchType(str, Enum):
    auto = "auto"
    artist = "artist"
    title = "title"
    identifier = "identifier"
    lyrics = "lyrics"
    label = "label"

class SearchQuery(BaseModel):
    query: str
    search_type: SearchType = SearchType.auto

class SearchResult(BaseModel):
    title: str
    artist: Optional[str] = None
    source: str
    url: Optional[str] = None
    confidence: Optional[float] = None
    external_id: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

class UnifiedSearchResponse(BaseModel):
    query: str
    detected_type: str
    results: List[SearchResult]
