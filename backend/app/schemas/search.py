from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Dict, Any
from enum import Enum

class SearchType(str, Enum):
    auto = "auto"
    artist = "artist"
    title = "title"
    identifier = "identifier"
    lyrics = "lyrics"
    label = "label"
    ai_models = "ai_models"
    github = "github"

class SearchQuery(BaseModel):
    query: str
    search_type: SearchType = SearchType.auto

class SearchResult(BaseModel):
    model_config = ConfigDict(extra="allow")

    title: str
    author: Optional[str] = None
    artist: Optional[str] = None
    source: str
    type: Optional[str] = None
    url: Optional[str] = None
    thumbnail: Optional[str] = None
    description: Optional[str] = None
    isrc: Optional[str] = None
    iswc: Optional[str] = None
    license: Optional[str] = None
    confidence: Optional[float] = None
    external_id: Optional[str] = None
    stars: Optional[int] = None
    downloads: Optional[int] = None
    likes: Optional[int] = None
    metadata: Optional[Dict[str, Any]] = None

class UnifiedSearchResponse(BaseModel):
    query: str
    detected_type: str
    results_count: int = 0
    results: List[SearchResult]
