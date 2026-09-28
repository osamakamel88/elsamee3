import sys
import os
import asyncio

# Ensure backend folder is on the Python path
BACKEND_DIR = os.path.join(os.path.dirname(__file__), "backend")
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

import gradio as gr
from app.main import app
from app.schemas.search import SearchQuery
from app.api.search import search as search_endpoint
from app.database import AsyncSessionLocal

async def execute_search(query: str):
    q = (query or "").strip()
    if not q:
        return "Please enter an artist, composer, lyricist, track name, or ISWC/ISRC code."
    
    try:
        async with AsyncSessionLocal() as session:
            payload = SearchQuery(query=q)
            res = await search_endpoint(payload, session)
            results = res.get("results", [])
            count = len(results)
            
            output_lines = [
                f"### 🔍 Results for: \"{q}\" (Detected: {res.get('detected_type')})",
                f"**Total Registered Records Found: {count}**\n",
                "| # | Source | Title / Work | Author / Creator | Identifier / Note |",
                "| :--- | :--- | :--- | :--- | :--- |"
            ]
            
            for idx, r in enumerate(results[:25]):
                source = r.get("source", "Unknown")
                title = r.get("title", "")
                author = r.get("artist") or r.get("author") or "N/A"
                ident = r.get("iswc") or r.get("isrc") or r.get("description", "")[:60]
                output_lines.append(f"| {idx+1} | **{source}** | {title} | {author} | `{ident}` |")
                
            return "\n".join(output_lines)
    except Exception as e:
        return f"Search error: {str(e)}"

def run_sync_search(query: str):
    """Bridge async search for Gradio."""
    try:
        loop = asyncio.get_event_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
    if loop.is_running():
        import concurrent.futures
        with concurrent.futures.ThreadPoolExecutor() as pool:
            future = pool.submit(lambda: asyncio.run(execute_search(query)))
            return future.result()
    else:
        return loop.run_until_complete(execute_search(query))

# Build Gradio UI
with gr.Blocks(title="elsamee3 | السميع - Copyright Guardian", theme=gr.themes.Soft()) as demo:
    gr.Markdown("""
    # 🎵 السميع — elsamee3
    ### Copyright Guardian & IP Protection for Composers, Lyricists & Artists
    **حارس حقوق الملكية الفكرية للملحنين والشعراء والمبدعين**
    """)
    
    with gr.Row():
        with gr.Column(scale=4):
            search_input = gr.Textbox(
                placeholder="Search by composer, lyricist, track, ISWC, ISRC (e.g. tamer, basem adel, amr diab, SACERAU)...",
                label="Search Repertoire & Collectives / ابحث عن مصنف أو فنان",
                lines=1
            )
        with gr.Column(scale=1):
            search_btn = gr.Button("🔍 Search / بحث", variant="primary")
            
    gr.Examples(
        examples=["tamer", "basem adel", "amr diab", "mohamed el nadi", "SACERAU", "SAIP"],
        inputs=search_input,
        label="Quick Examples / أمثلة سريعة"
    )
    
    results_output = gr.Markdown(label="Search Results / نتائج البحث")
    
    search_btn.click(fn=run_sync_search, inputs=search_input, outputs=results_output)
    search_input.submit(fn=run_sync_search, inputs=search_input, outputs=results_output)
    
    gr.Markdown("""
    ---
    🔗 **API Documentation & REST Endpoints:** Available at [`/docs`](/docs) | **OpenAPI Schema:** [`/openapi.json`](/openapi.json)
    """)

# Mount Gradio onto our FastAPI application
app = gr.mount_gradio_app(app, demo, path="/")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 7860))
    uvicorn.run("app:app", host="0.0.0.0", port=port, reload=False)
