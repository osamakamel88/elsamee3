from fastapi import APIRouter
from .auth import router as auth_router
from .works import router as works_router
from .search import router as search_router
from .monitoring import router as monitoring_router
from .alerts import router as alerts_router
from .takedowns import router as takedowns_router
from .valuation import router as valuation_router

api_router = APIRouter()
api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
api_router.include_router(works_router, prefix="/works", tags=["works"])
api_router.include_router(search_router, prefix="/search", tags=["search"])
api_router.include_router(monitoring_router, prefix="/monitoring", tags=["monitoring"])
api_router.include_router(alerts_router, prefix="/alerts", tags=["alerts"])
api_router.include_router(takedowns_router, prefix="/takedowns", tags=["takedowns"])
api_router.include_router(valuation_router, prefix="/valuation", tags=["valuation"])

