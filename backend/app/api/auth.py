from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserResponse, TokenResponse, AuthResponse
from app.services.auth_service import hash_password, verify_password, create_access_token
from app.api.deps import get_current_user
import uuid

router = APIRouter()

@router.post("/register", response_model=AuthResponse)
async def register(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == user_in.email))
    if result.scalars().first():
        raise HTTPException(status_code=400, detail="البريد الإلكتروني مسجل مسبقاً / Email already registered")
        
    username = user_in.username or user_in.email.split("@")[0]
    result = await db.execute(select(User).where(User.username == username))
    if result.scalars().first():
        username = f"{username}_{uuid.uuid4().hex[:4]}"
        
    user = User(
        email=user_in.email,
        username=username,
        hashed_password=hash_password(user_in.password),
        full_name=user_in.full_name,
        country=user_in.country or "EG",
        language=user_in.language or "ar",
        artist_type=user_in.artist_type or "musician"
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)

    access_token = create_access_token(data={"sub": str(user.id), "email": user.email})
    return {
        "status": "success",
        "message": "تم إنشاء الحساب بنجاح / Account registered",
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@router.post("/login", response_model=TokenResponse)
async def login(user_in: UserLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == user_in.email))
    user = result.scalars().first()
    if not user or not verify_password(user_in.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="البريد أو كلمة المرور غير صحيحة / Incorrect email or password")
        
    access_token = create_access_token(data={"sub": str(user.id), "email": user.email})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user
