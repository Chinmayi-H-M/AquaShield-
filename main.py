from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from schemas import WaterInput, PredictionResponse
from model_handler import get_model_handler
import uvicorn

# Initialize FastAPI app
app = FastAPI(
    title="AquaShield API",
    description="AI-Powered Water Potability Prediction System",
    version="1.0.0"
)

# Add CORS middleware support
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint
@app.get("/")
async def root():
    return {
        "project": "AquaShield",
        "message": "Welcome to the AquaShield Water Potability Prediction API",
        "status": "Active",
        "docs": "/docs"
    }

# Health check endpoint
@app.get("/health")
async def health_check():
    try:
        # Check if model is loaded
        handler = get_model_handler()
        return {
            "status": "Healthy",
            "model_loaded": True,
            "api_version": "1.0.0"
        }
    except Exception as e:
        return {
            "status": "Unhealthy",
            "error": str(e)
        }

# Prediction endpoint
@app.post("/predict", response_model=PredictionResponse)
async def predict(data: WaterInput):
    """
    Accepts water quality parameters and returns potability prediction.
    """
    try:
        handler = get_model_handler()
        result = handler.predict(data)
        
        # Craft a meaningful message
        is_safe = result["prediction"] == 1
        status_text = "Safe for consumption" if is_safe else "Unsafe for consumption"
        message = (
            f"The water analysis indicates it is {status_text}. "
            f"Risk Level is classified as {result['risk_level']}."
        )
        
        return {
            "prediction": result["prediction"],
            "potability": "Safe" if is_safe else "Unsafe",
            "confidence": round(result["confidence"], 2),
            "risk_score": round(result["risk_score"], 2),
            "risk_level": result["risk_level"],
            "message": message,
            "top_factors": result.get("top_factors", [])
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

# Instructions to run: uvicorn main:app --reload
if __name__ == "__main__":
    import os
    import uvicorn

    port = int(os.environ.get("PORT", 8000))

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True
    )
