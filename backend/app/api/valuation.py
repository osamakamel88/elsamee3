from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from app.services.valuation.royalty_calculator import (
    calculate_royalties_and_damages,
    ValuationRequest,
    ValuationResponse,
    CURRENCY_RATES,
    ROLE_SPLITS,
    DSP_RATES,
    YOUTUBE_METRICS,
    SYNC_BENCHMARKS
)

from app.services.valuation.live_auditor import audit_song_profits, AuditRequest, AuditResponse

router = APIRouter()

@router.post("", response_model=ValuationResponse)
@router.post("/estimate", response_model=ValuationResponse)
async def estimate_royalties(req: ValuationRequest):
    """
    Estimate multi-channel gross revenues, claimant-specific publishing/master shares,
    UGC virality tiers, and statutory DMCA / Arab IP Law settlement demands.
    """
    try:
        return calculate_royalties_and_damages(req)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Valuation calculation failed: {str(e)}")

@router.post("/audit", response_model=AuditResponse)
async def audit_track_profits(req: AuditRequest):
    """
    Audit real live multi-platform profits by song title, artist, or URL.
    Fetches real YouTube view counts and DSP presence in real time.
    """
    try:
        return await audit_song_profits(req)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Track live audit failed: {str(e)}")



@router.get("/benchmarks")
async def get_benchmarks() -> Dict[str, Any]:
    """
    Returns current industry pay-per-stream benchmarks, YouTube CPMs,
    currency conversion rates, and standard split matrices.
    """
    return {
        "currencies": CURRENCY_RATES,
        "dsp_rates": DSP_RATES,
        "youtube_metrics": YOUTUBE_METRICS,
        "sync_benchmarks": SYNC_BENCHMARKS,
        "role_splits": ROLE_SPLITS
    }
