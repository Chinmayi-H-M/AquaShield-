# AquaShield Backend - API Documentation

This is the FastAPI backend for the **AquaShield** AI-powered water potability prediction system.

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the Server**:
   ```bash
   uvicorn main:app --reload
   ```
   The API will be available at `http://localhost:8000`.

3. **Access Documentation**:
   - Interactive Swagger UI: `http://localhost:8000/docs`
   - ReDoc: `http://localhost:8000/redoc`

## API Endpoints

### 1. GET `/`
Welcome message and project status.

### 2. GET `/health`
Health check to ensure the API and ML model are operational.

### 3. POST `/predict`
Predicts water potability based on quality parameters.

**Example Request Body:**
```json
{
  "ph": 7.08,
  "Hardness": 204.89,
  "Solids": 20791.31,
  "Chloramines": 7.30,
  "Sulfate": 368.51,
  "Conductivity": 564.30,
  "Organic_carbon": 10.37,
  "Trihalomethanes": 86.99,
  "Turbidity": 2.96
}
```

**Example Response Body:**
```json
{
  "prediction": 0,
  "potability": "Unsafe",
  "confidence": 62.45,
  "risk_score": 62.45,
  "risk_level": "High Risk",
  "message": "The water analysis indicates it is Unsafe for consumption. Risk Level is classified as High Risk."
}
```

## Risk Level Scale
- **0–25**: Safe
- **26–50**: Moderate Risk
- **51–75**: High Risk
- **76–100**: Critical

## Project Structure
- `main.py`: Entry point and route definitions.
- `schemas.py`: Pydantic models for request/response validation.
- `model_handler.py`: Model loading and feature engineering logic.
- `models/`: Directory containing the trained `.pkl` model.
