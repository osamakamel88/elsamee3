from http.server import BaseHTTPRequestHandler
import json
import sys
import os

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        
        info = {
            "python_version": sys.version,
            "cwd": os.getcwd(),
            "env_keys": [k for k in os.environ.keys() if "SECRET" not in k and "KEY" not in k and "TOKEN" not in k],
            "modules": {}
        }
        
        for mod in [
            'fastapi', 'uvicorn', 'pydantic', 'pydantic_settings', 'httpx',
            'sqlalchemy', 'aiosqlite', 'PIL', 'numpy',
            'jinja2', 'aiofiles', 'jose', 'passlib', 'bcrypt'
        ]:
            try:
                __import__(mod)
                info["modules"][mod] = "OK"
            except Exception as e:
                info["modules"][mod] = f"ERROR: {str(e)}"
                
        backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend"))
        sys.path.insert(0, backend_dir)
        try:
            from app.main import app
            info["app_main"] = "OK"
        except Exception as e:
            import traceback
            info["app_main"] = f"ERROR: {traceback.format_exc()}"
            
        self.wfile.write(json.dumps(info, indent=2).encode('utf-8'))
