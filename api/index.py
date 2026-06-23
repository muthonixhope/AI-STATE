import sys
import os

# Make backend modules importable
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "backend"))

from main import app  # noqa: F401  – Vercel picks up `app` as the ASGI handler
