from pydantic import BaseModel, Field
from typing import Optional, List, Dict

class WaterInput(BaseModel):
    """
    Pydantic model for water quality parameters input.
    """
    ph: float = Field(..., description="pH level of water (0 to 14)")
    Hardness: float = Field(..., description="Hardness of water (mg/L)")
    Solids: float = Field(..., description="Total dissolved solids (ppm)")
    Chloramines: float = Field(..., description="Amount of Chloramines (ppm)")
    Sulfate: float = Field(..., description="Amount of Sulfates (mg/L)")
    Conductivity: float = Field(..., description="Electrical conductivity (μS/cm)")
    Organic_carbon: float = Field(..., description="Amount of organic carbon (ppm)")
    Trihalomethanes: float = Field(..., description="Amount of Trihalomethanes (μg/L)")
    Turbidity: float = Field(..., description="Turbidity of water (NTU)")

    class Config:
        json_schema_extra = {
            "example": {
                "ph": 7.0,
                "Hardness": 204.89,
                "Solids": 20791.31,
                "Chloramines": 7.30,
                "Sulfate": 368.51,
                "Conductivity": 564.30,
                "Organic_carbon": 10.37,
                "Trihalomethanes": 86.99,
                "Turbidity": 2.96
            }
        }

class PredictionResponse(BaseModel):
    """
    Structured response for water potability prediction.
    """
    prediction: int = Field(..., description="0 = Unsafe, 1 = Safe")
    potability: str = Field(..., description="Human readable result")
    confidence: float = Field(..., description="Confidence percentage")
    risk_score: float = Field(..., description="Risk score (0-100)")
    risk_level: str = Field(..., description="Risk category")
    message: str = Field(..., description="Detailed message for the user")
    top_factors: List[Dict] = Field(default_factory=list, description="Top contributing factors")
