#!/bin/bash
set -e

echo "Starting PolyAI ROI Calculator API..."
echo "Python version: $(python --version)"
echo "Working directory: $(pwd)"
echo "Contents: $(ls -la)"

cd backend
echo "Backend directory contents: $(ls -la)"

# Install dependencies if needed
if [ ! -d "__pycache__" ]; then
    echo "Installing Python dependencies..."
    pip install -r requirements.txt
fi

echo "Starting uvicorn server..."
exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}