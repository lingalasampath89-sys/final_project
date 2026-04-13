"""
MAIN TRAIN SCRIPT
Runs full dataset generation + model training
"""

import os

from core.dataset_generator import generate_xml_dataset
from core.dataset_builder import build_dataset
from core.train_models import train_models


def create_required_folders():

    folders = [

        "data/training_xml",
        "datasets",
        "models",
        "outputs/schema",
        "outputs/structure",
        "outputs/datatypes",
        "outputs/parsed",
        "outputs/anomalies",
        "outputs/validation",
        "outputs/reports"
    ]

    for folder in folders:
        os.makedirs(folder, exist_ok=True)

    print("Folders ready")


def main():

    print("\n===================================")
    print("AI XML SYSTEM TRAINING STARTED")
    print("===================================\n")

    create_required_folders()

    print("\nSTEP 1: Generating XML Dataset")
    generate_xml_dataset()

    print("\nSTEP 2: Building ML Dataset")
    build_dataset()

    print("\nSTEP 3: Training ML Models")
    train_models()

    print("\n===================================")
    print("TRAINING COMPLETED SUCCESSFULLY")
    print("===================================\n")


if __name__ == "__main__":
    main()