#!/bin/bash
set -e

echo "Starting PolyAI ROI Calculator API..."
echo "Python version: $(python --version)"
echo "Working directory: $(pwd)"
echo "Contents: $(ls -la)"

echo "Starting uvicorn server..."
exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}