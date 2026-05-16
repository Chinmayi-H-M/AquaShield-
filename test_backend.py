import sys
from model_handler import get_model_handler
from schemas import WaterInput

def test_prediction():
    try:
        handler = get_model_handler()
        
        # Sample input
        sample = WaterInput(
            ph=7.08,
            Hardness=204.89,
            Solids=20791.31,
            Chloramines=7.30,
            Sulfate=368.51,
            Conductivity=564.30,
            Organic_carbon=10.37,
            Trihalomethanes=86.99,
            Turbidity=2.96
        )
        
        result = handler.predict(sample)
        print("\nTest Prediction Result:")
        print(f"Prediction: {result['prediction']}")
        print(f"Confidence: {result['confidence']:.2f}%")
        print(f"Risk Score: {result['risk_score']:.2f}")
        print(f"Risk Level: {result['risk_level']}")
        
        print("\nSUCCESS: Model handler is working correctly.")
        
    except Exception as e:
        print(f"\nERROR: Test failed - {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    test_prediction()
