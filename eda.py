import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

print("Program started")

# Load cleaned dataset
df = pd.read_csv("data/cleaned_water_potability.csv")

print("Dataset loaded")

# First 5 rows
print(df.head())

# Dataset statistics
print(df.describe())

# Check class balance
print(df['Potability'].value_counts())

print("Showing countplot")

# Plot class distribution
sns.countplot(x='Potability', data=df)
plt.title("Water Potability Distribution")
plt.show()

print("Showing heatmap")

# Correlation heatmap
plt.figure(figsize=(10,8))
sns.heatmap(df.corr(), annot=True, cmap='coolwarm')
plt.title("Feature Correlation Heatmap")
plt.show()

print("EDA completed")