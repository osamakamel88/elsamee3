# ==========================================
# Multi-stage Dockerfile for Hugging Face Spaces
# 1. Build React Frontend (Vite)
# 2. Package FastAPI Backend & Serve Everything
# ==========================================

# Stage 1: Build Frontend
FROM node:20-slim AS frontend-builder
WORKDIR /build

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build

# Stage 2: Python Backend Runtime
FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=7860

# Install system audio & fingerprint dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    libchromaprint-dev \
    fpcalc \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Hugging Face Spaces expects non-root user with UID 1000
RUN useradd -m -u 1000 user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH

WORKDIR /app

# Install Python dependencies
COPY --chown=user:user backend/requirements.txt backend/pyproject.toml ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source
COPY --chown=user:user backend/ ./

# Copy built frontend assets into static directory so FastAPI serves the UI
COPY --from=frontend-builder --chown=user:user /build/dist ./static/

# Fix permissions
RUN chown -R user:user /app

USER user

EXPOSE 7860

CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-7860}"]
