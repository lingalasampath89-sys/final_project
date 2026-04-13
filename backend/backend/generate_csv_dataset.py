import os
import numpy as np
import pandas as pd

from core.feature_engineer import XMLFeatureEngineer

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.join(BASE_DIR, "data", "raw_xml")
CSV_OUTPUT_PATH = os.path.join(BASE_DIR, "data", "dataset.csv")


def generate_csv():

    engineer = XMLFeatureEngineer()
    rows = []

    print("Reading XML dataset from:", DATASET_PATH)

    if not os.path.exists(DATASET_PATH):
        print("❌ raw_xml folder not found")
        return

    for label in os.listdir(DATASET_PATH):

        label_folder = os.path.join(DATASET_PATH, label)

        if not os.path.isdir(label_folder):
            continue

        print("Processing class:", label)

        for file in os.listdir(label_folder):

            file_path = os.path.join(label_folder, file)

            try:
                features = engineer.process_file(file_path)

                if features is not None:
                    row = list(features)
                    row.append(label)
                    rows.append(row)

            except Exception as e:
                print("Error:", file_path)
                print(e)

    if len(rows) == 0:
        print("❌ No data extracted")
        return

    # Create column names
    feature_columns = [f"f{i}" for i in range(1, 46)]
    feature_columns.append("label")

    df = pd.DataFrame(rows, columns=feature_columns)

    os.makedirs(os.path.join(BASE_DIR, "data"), exist_ok=True)
    df.to_csv(CSV_OUTPUT_PATH, index=False)

    print("✅ CSV Dataset Generated Successfully!")
    print("Total samples:", len(df))
    print("Saved at:", CSV_OUTPUT_PATH)


if __name__ == "__main__":
    generate_csv()