import pandas as pd
import pickle
from sklearn.ensemble import RandomForestRegressor

df = pd.read_csv("../dataset.csv")  # if inside model folder

X = df[["image_count"]]
y = df["total_boxes"]

model = RandomForestRegressor()
model.fit(X, y)

with open("xml_model.pkl", "wb") as f:
    pickle.dump(model, f)

print("Model trained successfully ✅")