from typing import List, Dict, Any
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.database import get_db
from app.models.user import User
from app.models.scan_job import ScanJob
from app.models.writer_watchlist import WriterWatchlist
from app.schemas.writer_watchlist import (
    WriterWatchlistCreate,
    WriterWatchlistUpdate,
    WriterWatchlistResponse,
    ScanResultResponse
)
from app.services.search.sentinel_service import sentinel_service
from app.api.deps import get_current_user

router = APIRouter()

# ----------------- Existing Job Endpoints -----------------

@router.get("/jobs")
async def list_scan_jobs(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ScanJob).where(ScanJob.user_id == current_user.id))
    return result.scalars().all()

@router.post("/scan")
async def trigger_scan(work_id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return {"status": "scan initiated for work " + work_id}


# ----------------- Writer & Handler Sentinel Endpoints -----------------

@router.get("/handlers", response_model=List[WriterWatchlistResponse])
async def list_writer_handlers(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """List all lyricist/composer handlers monitored by the current user."""
    result = await db.execute(
        select(WriterWatchlist).where(WriterWatchlist.user_id == current_user.id).order_by(WriterWatchlist.created_at.desc())
    )
    return result.scalars().all()


@router.post("/handlers", response_model=WriterWatchlistResponse, status_code=status.HTTP_201_CREATED)
async def create_writer_handler(
    payload: WriterWatchlistCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Add a new lyricist or composer name/handler to continuous scraping & monitoring."""
    handler = WriterWatchlist(
        user_id=current_user.id,
        name=payload.name,
        legal_name=payload.legal_name,
        ipi_number=payload.ipi_number,
        role=payload.role or "lyricist",
        aliases=payload.aliases or [payload.name],
        publishers=payload.publishers or [],
        monitoring_enabled=payload.monitoring_enabled if payload.monitoring_enabled is not None else True,
        monitoring_frequency_hours=payload.monitoring_frequency_hours or 12
    )
    db.add(handler)
    await db.commit()
    await db.refresh(handler)

    # Automatically trigger first background scan
    try:
        await sentinel_service.scan_writer_handler(handler.id, db)
        await db.refresh(handler)
    except Exception as e:
        # Don't fail the create if external API has a hiccup
        pass

    return handler


@router.get("/handlers/{handler_id}", response_model=WriterWatchlistResponse)
async def get_writer_handler(
    handler_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get full details, registered works, and live stats for a specific watched handler."""
    result = await db.execute(
        select(WriterWatchlist).where(
            WriterWatchlist.id == handler_id,
            WriterWatchlist.user_id == current_user.id
        )
    )
    handler = result.scalar_one_or_none()
    if not handler:
        raise HTTPException(status_code=404, detail="Handler not found")
    return handler


@router.put("/handlers/{handler_id}", response_model=WriterWatchlistResponse)
async def update_writer_handler(
    handler_id: UUID,
    payload: WriterWatchlistUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update settings for a watched handler (aliases, publishers, frequency)."""
    result = await db.execute(
        select(WriterWatchlist).where(
            WriterWatchlist.id == handler_id,
            WriterWatchlist.user_id == current_user.id
        )
    )
    handler = result.scalar_one_or_none()
    if not handler:
        raise HTTPException(status_code=404, detail="Handler not found")

    if payload.name is not None:
        handler.name = payload.name
    if payload.legal_name is not None:
        handler.legal_name = payload.legal_name
    if payload.ipi_number is not None:
        handler.ipi_number = payload.ipi_number
    if payload.role is not None:
        handler.role = payload.role
    if payload.aliases is not None:
        handler.aliases = payload.aliases
    if payload.publishers is not None:
        handler.publishers = payload.publishers
    if payload.monitoring_enabled is not None:
        handler.monitoring_enabled = payload.monitoring_enabled
    if payload.monitoring_frequency_hours is not None:
        handler.monitoring_frequency_hours = payload.monitoring_frequency_hours

    await db.commit()
    await db.refresh(handler)
    return handler


@router.delete("/handlers/{handler_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_writer_handler(
    handler_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Remove a writer/handler from monitoring."""
    result = await db.execute(
        select(WriterWatchlist).where(
            WriterWatchlist.id == handler_id,
            WriterWatchlist.user_id == current_user.id
        )
    )
    handler = result.scalar_one_or_none()
    if not handler:
        raise HTTPException(status_code=404, detail="Handler not found")

    await db.delete(handler)
    await db.commit()
    return None


@router.post("/handlers/{handler_id}/scan", response_model=ScanResultResponse)
async def trigger_handler_scan(
    handler_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Trigger immediate multi-entity scan across The MLC, SACEM de Paris, DistroKid, and DSPs."""
    result = await db.execute(
        select(WriterWatchlist).where(
            WriterWatchlist.id == handler_id,
            WriterWatchlist.user_id == current_user.id
        )
    )
    handler = result.scalar_one_or_none()
    if not handler:
        raise HTTPException(status_code=404, detail="Handler not found")

    scan_res = await sentinel_service.scan_writer_handler(handler.id, db)
    return scan_res


@router.post("/quick-seed", response_model=WriterWatchlistResponse)
async def quick_seed_partner(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Quick-seed the user's partner profile:
    BASSEM ADEL EL SAID HASSAN (IPI: 00883594582, Mazzika Group, 14 MLC works)
    for instant out-of-the-box monitoring.
    """
    # Check if already exists
    existing = await db.execute(
        select(WriterWatchlist).where(
            WriterWatchlist.user_id == current_user.id,
            WriterWatchlist.ipi_number == "00883594582"
        )
    )
    found = existing.scalar_one_or_none()
    if found:
        # Trigger scan and return
        await sentinel_service.scan_writer_handler(found.id, db)
        await db.refresh(found)
        return found

    handler = WriterWatchlist(
        user_id=current_user.id,
        name="Bassem Adel (باسم عادل)",
        legal_name="BASSEM ADEL EL SAID HASSAN",
        ipi_number="00883594582",
        role="lyricist",
        aliases=["باسم عادل", "Bassem Adel", "BASSEM ADEL EL SAID HASSAN", "Bassem Adel Hassan"],
        publishers=["Mazzika Group", "S D R M"],
        mlc_ip_id=17589818,
        monitoring_enabled=True,
        monitoring_frequency_hours=12
    )
    db.add(handler)
    await db.commit()
    await db.refresh(handler)

    # Perform instant live scan
    await sentinel_service.scan_writer_handler(handler.id, db)
    await db.refresh(handler)
    return handler
