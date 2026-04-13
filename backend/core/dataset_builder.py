import os
import pandas as pd
import xml.etree.ElementTree as ET

# absolute path calculation
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

xml_folder = os.path.join(BASE_DIR, "data", "training_xml")
dataset_folder = os.path.join(BASE_DIR, "datasets")

os.makedirs(dataset_folder, exist_ok=True)

rows = []

print("Reading XML files from:", xml_folder)

for file in os.listdir(xml_folder):

    if file.endswith(".xml"):

        file_path = os.path.join(xml_folder, file)

        try:

            tree = ET.parse(file_path)
            root = tree.getroot()

            row = {}

            for child in root:
                row[child.tag] = child.text

            rows.append(row)

        except Exception as e:
            print("Error reading:", file, e)


df = pd.DataFrame(rows)

csv_path = os.path.join(dataset_folder, "xml_dataset.csv")

df.to_csv(csv_path, index=False)

print("Dataset created successfully!")
print("Saved at:", csv_path)
print("Total rows:", len(df))