from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.services.bhoonidhi import BhoonidhiClient
from app.services.llm_agent import ConsensusAgent

# THIS IS THE LINE UVICORN WAS LOOKING FOR:
app = FastAPI(title="SatQuery AI Backend", version="1.0.0")

# Allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

bhoonidhi_client = BhoonidhiClient()
ai_agent = ConsensusAgent()

class QueryRequest(BaseModel):
    prompt: str
    bbox: list[float]
    start_date: str = "2026-01-01"
    end_date: str = "2026-09-01"

@app.post("/api/v1/analyze")
async def process_satellite_query(req: QueryRequest):
    try:
        # 1. Fetch data securely from Bhoonidhi
        datasets = bhoonidhi_client.fetch_satellite_metadata(req.bbox, req.start_date, req.end_date)
        
        # 2. Run the AI Agent pipeline
        agent_results = ai_agent.analyze_query(req.prompt, req.bbox, datasets)
        
        return {
            "status": "success",
            "query": req.prompt,
            "active_datasets": datasets,
            "agent_response": agent_results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))