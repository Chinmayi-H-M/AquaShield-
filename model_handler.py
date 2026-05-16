import joblib
import pandas as pd
import numpy as np
import os
from schemas import WaterInput

class ModelHandler:
    def __init__(self, model_path: str = "models/water_model.pkl"):
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found at {model_path}")
        self.model = joblib.load(model_path)
        print(f"Successfully loaded model from {model_path}")

    def preprocess(self, input_data: WaterInput) -> pd.DataFrame:
        """
        Replicates the feature engineering from cleaning.py:
        1. Original non-poly columns
        2. Polynomial interaction features (degree 2)
        3. Custom ratios
        """
        # Convert input to dict
        data = input_data.dict()
        
        # 1. Non-poly columns
        non_poly_cols = ['Chloramines', 'Conductivity', 'Organic_carbon', 'Trihalomethanes', 'Turbidity']
        df_non_poly = pd.DataFrame([{col: data[col] for col in non_poly_cols}])
        
        # 2. Polynomial Interaction Features for ph, Solids, Sulfate, Hardness
        # Interaction only: ph*Solids, ph*Sulfate, ph*Hardness, Solids*Sulfate, Solids*Hardness, Sulfate*Hardness
        poly_base_cols = ['ph', 'Solids', 'Sulfate', 'Hardness']
        
        # Original poly cols
        df_poly = pd.DataFrame([{col: data[col] for col in poly_base_cols}])
        
        # Interactions
        df_poly['ph Solids'] = data['ph'] * data['Solids']
        df_poly['ph Sulfate'] = data['ph'] * data['Sulfate']
        df_poly['ph Hardness'] = data['ph'] * data['Hardness']
        df_poly['Solids Sulfate'] = data['Solids'] * data['Sulfate']
        df_poly['Solids Hardness'] = data['Solids'] * data['Hardness']
        df_poly['Sulfate Hardness'] = data['Sulfate'] * data['Hardness']
        
        # Combine
        df_final = pd.concat([df_non_poly, df_poly], axis=1)
        
        # 3. Add Custom Ratios
        df_final['Sulfate_Hardness_Ratio'] = data['Sulfate'] / (data['Hardness'] + 1e-6)
        df_final['Organic_Chlorine_Ratio'] = data['Organic_carbon'] / (data['Chloramines'] + 1e-6)
        
        return df_final

    def predict(self, input_data: WaterInput):
        # Preprocess
        df_features = self.preprocess(input_data)
        
        # Get prediction and probabilities
        prediction = int(self.model.predict(df_features)[0])
        probabilities = self.model.predict_proba(df_features)[0]
        
        # Confidence logic:
        # If prediction is 1 (Safe), confidence is prob(1)
        # If prediction is 0 (Unsafe), confidence is prob(0)
        confidence = float(probabilities[prediction] * 100)
        
        # Risk Score calculation:
        # We define Risk Score as the probability of the water being Unsafe (class 0)
        risk_score = float(probabilities[0] * 100)
        
        # Determine Risk Level based on requested scale
        # 0–25 → Safe, 26–50 → Moderate Risk, 51–75 → High Risk, 76–100 → Critical
        if risk_score <= 25:
            risk_level = "Safe"
        elif risk_score <= 50:
            risk_level = "Moderate Risk"
        elif risk_score <= 75:
            risk_level = "High Risk"
        else:
            risk_level = "Critical"
            
        return {
            "prediction": prediction,
            "confidence": confidence,
            "risk_score": risk_score,
            "risk_level": risk_level
        }

# Singleton instance
handler = None

def get_model_handler():
    global handler
    if handler is None:
        handler = ModelHandler()
    return handler
