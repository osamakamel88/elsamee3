from http.server import BaseHTTPRequestHandler
import json
import os
import sys
import asyncio

# Ensure VERCEL environment variable is active
os.environ["VERCEL"] = "1"

# Ensure backend directory is in sys.path
backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend"))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.services.valuation.royalty_calculator import (
    calculate_royalties_and_damages,
    ValuationRequest,
    CURRENCY_RATES,
    ROLE_SPLITS,
    DSP_RATES,
    YOUTUBE_METRICS,
    SYNC_BENCHMARKS
)
from app.services.valuation.live_auditor import (
    audit_song_profits,
    AuditRequest
)

class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()

    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps({
            "status": "online",
            "endpoint": "/api/valuation",
            "description": "elsamee3 Royalty & Damages Valuation Engine (السميع)",
            "currencies": CURRENCY_RATES,
            "dsp_rates": DSP_RATES,
            "youtube_metrics": YOUTUBE_METRICS,
            "sync_benchmarks": SYNC_BENCHMARKS,
            "role_splits": ROLE_SPLITS
        }).encode('utf-8'))

    def do_POST(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            body_bytes = self.rfile.read(content_length) if content_length > 0 else b'{}'
            body_str = body_bytes.decode('utf-8')
            payload = json.loads(body_str) if body_str else {}

            # Distinguish between Live Audit vs Manual Valuation
            is_audit = (
                "audit" in self.path
                or payload.get("action") == "audit"
                or ("query" in payload and "youtube_views" not in payload)
            )

            if is_audit:
                audit_req = AuditRequest(**payload)
                res = asyncio.run(audit_song_profits(audit_req))
                out_data = res.model_dump()
            else:
                req = ValuationRequest(**payload)
                res = calculate_royalties_and_damages(req)
                out_data = res.model_dump()

            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(out_data, default=str).encode('utf-8'))

        except Exception as e:
            import traceback
            err = traceback.format_exc()
            self.send_response(400)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({
                "error": "Valuation operation failed",
                "message": str(e),
                "traceback": err
            }).encode('utf-8'))
