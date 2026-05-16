import pandas as pd
import numpy as np
from sklearn.experimental import enable_iterative_imputer
from sklearn.impute import IterativeImputer
from sklearn.preprocessing import PolynomialFeatures

# Load dataset
df = pd.read_csv("data/water_potability.csv")

print(f"Original shape: {df.shape}")

# Iterative Imputation (MICE)
print("Performing Iterative Imputation...")
imputer = IterativeImputer(random_state=42, max_iter=10)
df_imputed = pd.DataFrame(imputer.fit_transform(df), columns=df.columns)

# Feature Engineering: Polynomial Features (degree 2)
# We only want interactions between the most important features to avoid dimension explosion
# Top features: ph, Solids, Sulfate, Hardness
poly = PolynomialFeatures(degree=2, interaction_only=True, include_bias=False)
poly_cols = ['ph', 'Solids', 'Sulfate', 'Hardness']
poly_features = poly.fit_transform(df_imputed[poly_cols])
poly_feature_names = poly.get_feature_names_out(poly_cols)

# Create a DataFrame for polynomial features
df_poly = pd.DataFrame(poly_features, columns=poly_feature_names)

# Combine original and new features
# Drop the original poly_cols to avoid redundancy after merging
df_final = pd.concat([df_imputed.drop(poly_cols, axis=1), df_poly], axis=1)

# Add custom ratios
df_final['Sulfate_Hardness_Ratio'] = df_final['Sulfate'] / (df_final['Hardness'] + 1e-6)
df_final['Organic_Chlorine_Ratio'] = df_final['Organic_carbon'] / (df_final['Chloramines'] + 1e-6)

# Save cleaned dataset
df_final.to_csv("data/cleaned_water_potability.csv", index=False)

print(f"Dataset cleaned and engineered. Final shape: {df_final.shape}")
print("Cleaned dataset saved successfully!")