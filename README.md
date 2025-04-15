# FastAPI + SQLite + Next.js Setup Guide

This guide explains how to set up and run a project with FastAPI and SQLite as the backend and Next.js as the frontend.

## Prerequisites

- Python 3.8+
- Node.js and npm

## Backend Setup (FastAPI + SQLite)

1. **Create and activate a virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment variables**
   Create a `.env` file in the backend directory with:
   ```
   DATABASE_URL=sqlite:///./app.db
   SECRET_KEY=787aa249391ad7ff843dcba3c2058317f5d4dc200ad8b527270b7f9659452c3a
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ```

4. **Run the development server**
   ```bash
   python run.py
   ```

5. **Access the FastAPI documentation**
   Open http://localhost:8000/docs in your browser

## Frontend Setup (Next.js)

1. **Next.js app**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install 
   ```

3. **Configure environment variables**
   Create a `.env.local` file in the frontend directory with:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Access the Next.js application**
   Open http://localhost:3000 in your browser


