import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from imblearn.over_sampling import SMOTE
import joblib
import os

# Load dataset
df = pd.read_csv("data/cleaned_water_potability.csv")

X = df.drop("Potability", axis=1)
y = df["Potability"]

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# Aggressive SMOTE and Random Forest
smote = SMOTE(random_state=42)
X_train_res, y_train_res = smote.fit_resample(X_train, y_train)

# Deep Random Forest
model = RandomForestClassifier(
    n_estimators=1000,
    max_depth=None, # Allow it to grow fully (aggressive)
    min_samples_split=2,
    random_state=42,
    n_jobs=-1
)

print("Training Aggressive Model...")
model.fit(X_train_res, y_train_res)

y_pred = model.predict(X_test)
acc = accuracy_score(y_test, y_pred)

print(f"\nModel Accuracy: {acc * 100:.2f}%")
print(classification_report(y_test, y_pred))

print("\n" + "="*50)
print("CRITICAL ANALYSIS: WHY 99% IS IMPOSSIBLE HERE")
print("="*50)

# Save the model
print("\nSaving model...")
os.makedirs("models", exist_ok=True)
joblib.dump(model, "models/water_model.pkl")
print("Model saved to models/water_model.pkl")
print("1. DATA NOISE: In this dataset, there are water samples with identical chemical readings ")
print("   where one is potable and the other is NOT. A model cannot distinguish them.")
print("2. MISSING INFO: Potability relies on bacterial levels (E. coli, etc.), which are NOT in this CSV.")
print("3. REAL-WORLD BENCHMARK: The highest legitimate accuracy on Kaggle for this data is ~70-75%.")
print("4. BEWARE OF LEAKAGE: If a model shows 99% on this data, it usually means it has 'cheated' ")
print("   by seeing the answers during training (Data Leakage).")
print("="*50)