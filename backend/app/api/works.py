from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional
import os
import uuid
import aiofiles
from app.database import get_db
from app.models.user import User
from app.models.work import Work
from app.schemas.work import WorkResponse, WorkListResponse, WorkUpdate
from app.api.deps import get_current_user
from app.services.fingerprint.audio_fingerprint import fingerprint_audio
from app.services.fingerprint.image_fingerprint import fingerprint_image
from app.services.fingerprint.lyrics_matcher import compute_lyrics_fingerprint

router = APIRouter()

import tempfile

if os.environ.get("VERCEL") or os.environ.get("AWS_LAMBDA_FUNCTION_NAME"):
    UPLOAD_DIR = os.path.join(tempfile.gettempdir(), "uploads")
else:
    UPLOAD_DIR = "uploads"

try:
    os.makedirs(UPLOAD_DIR, exist_ok=True)
except Exception:
    pass

@router.get("", response_model=WorkListResponse)
async def list_works(skip: int = 0, limit: int = 100, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Work).where(Work.user_id == current_user.id).offset(skip).limit(limit))
    works = result.scalars().all()
    count_result = await db.execute(select(Work).where(Work.user_id == current_user.id))
    total = len(count_result.scalars().all())
    return {"items": works, "total": total}

@router.post("", response_model=WorkResponse)
async def create_work(
    title: str = Form(...),
    work_type: str = Form(...),
    title_ar: Optional[str] = Form(None),
    composer: Optional[str] = Form(None),
    lyricist: Optional[str] = Form(None),
    performer: Optional[str] = Form(None),
    arranger: Optional[str] = Form(None),
    lyrics_text: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    description_ar: Optional[str] = Form(None),
    isrc: Optional[str] = Form(None),
    iswc: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    file_path = None
    duration = None
    width = None
    height = None

    if file and file.filename:
        file_ext = os.path.splitext(file.filename)[1]
        file_path = os.path.join(UPLOAD_DIR, f"{uuid.uuid4()}{file_ext}")
        
        async with aiofiles.open(file_path, 'wb') as out_file:
            content = await file.read()
            await out_file.write(content)

        if work_type == "audio":
            try:
                fp_data = await fingerprint_audio(file_path)
                duration = fp_data.get("duration")
            except Exception as e:
                pass
        elif work_type == "image":
            try:
                fp_data = await fingerprint_image(file_path)
                width = fp_data.get("width")
                height = fp_data.get("height")
            except Exception as e:
                pass

    metadata = {}
    if lyrics_text:
        metadata["lyrics_fingerprint"] = compute_lyrics_fingerprint(lyrics_text)

    work = Work(
        user_id=current_user.id,
        title=title,
        title_ar=title_ar,
        work_type=work_type,
        composer=composer,
        lyricist=lyricist,
        performer=performer,
        arranger=arranger,
        lyrics_text=lyrics_text,
        description=description,
        description_ar=description_ar,
        isrc=isrc,
        iswc=iswc,
        file_path=file_path,
        duration_seconds=duration,
        width=width,
        height=height,
        metadata_json=metadata
    )
    db.add(work)
    await db.commit()
    await db.refresh(work)
    return work

@router.get("/{work_id}", response_model=WorkResponse)
async def get_work(work_id: uuid.UUID, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Work).where(Work.id == work_id, Work.user_id == current_user.id))
    work = result.scalars().first()
    if not work:
        raise HTTPException(status_code=404, detail="Work not found")
    return work

@router.delete("/{work_id}")
async def delete_work(work_id: uuid.UUID, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Work).where(Work.id == work_id, Work.user_id == current_user.id))
    work = result.scalars().first()
    if not work:
        raise HTTPException(status_code=404, detail="Work not found")
    await db.delete(work)
    await db.commit()
    return {"status": "deleted"}
