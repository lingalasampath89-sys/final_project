import os
import joblib
import logging
import numpy as np
import pandas as pd
import xml.etree.ElementTree as ET
from typing import Dict, Any, List
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, KFold, cross_val_score
from core.feature_extractor import extract_features, robust_extract_broken

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("XMLErrorPredictor")

MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "models", "error_prediction_model.pkl")

class XMLErrorPredictor:
    """
    AI-powered XML Error Prediction System using Random Forest.
    Analyzes structural features to predict probability and severity of hidden issues.
    """

    def __init__(self):
        self.model = None
        self.feature_columns = [
            "total_tags", "unique_tags_count", "attributes_count", 
            "empty_nodes_count", "max_depth", "relationship_pairs", 
            "avg_attributes_per_tag", "unmatched_tags"
        ]
        self.load_model()

    def load_model(self):
        if os.path.exists(MODEL_PATH):
            try:
                self.model = joblib.load(MODEL_PATH)
                logger.info("Successfully loaded Error Prediction Model.")
            except Exception as e:
                logger.error(f"Failed to load model: {e}")
                self.train_on_synthetic_data()
        else:
            logger.warning("Model not found. Training on synthetic data...")
            self.train_on_synthetic_data()

    def train_on_synthetic_data(self):
        """
        Generates a diverse synthetic dataset and trains a Random Forest Classifier.
        Includes valid and invalid XML features.
        """
        logger.info("Generating diverse training dataset...")
        data = []
        
        # Labels: 0 = No Error, 1 = Low, 2 = Medium, 3 = High Severity
        # Feature vector: [total_tags, unique_tags, attrs, empty, depth, pairs, avg_attr, unmatched]
        
        # Valid XML samples
        for _ in range(200):
            tags = np.random.randint(5, 50)
            data.append([tags, tags // 2, tags * 1.5, 0, 4, tags - 1, 1.5, 0, 0])
            
        # Missing closing tags (High Severity)
        for _ in range(100):
            tags = np.random.randint(5, 50)
            data.append([tags, tags // 2, tags * 1.2, 0, 3, tags - 2, 1.2, np.random.randint(1, 5), 3])
            
        # Empty nodes / Logical gaps (Low Severity)
        for _ in range(100):
            tags = np.random.randint(10, 30)
            data.append([tags, tags // 2, tags, np.random.randint(3, 8), 4, tags - 1, 1.0, 0, 1])
            
        # Depth violations / Complex structure (Medium Severity)
        for _ in range(100):
            tags = np.random.randint(20, 100)
            data.append([tags, tags // 3, tags * 0.5, 2, np.random.randint(8, 15), tags // 2, 0.5, 0, 2])

        df = pd.DataFrame(data, columns=self.feature_columns + ["severity"])
        X = df[self.feature_columns]
        y = df["severity"]

        # Prevent Overfitting: Limit depth, use k-fold
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        self.model = RandomForestClassifier(
            n_estimators=100, 
            max_depth=10,        # Regularization skip overfitting
            min_samples_split=5, 
            random_state=42
        )
        
        # K-Fold Cross Validation
        kf = KFold(n_splits=5, shuffle=True, random_state=42)
        scores = cross_val_score(self.model, X, y, cv=kf)
        logger.info(f"Cross-Validation Accuracy: {np.mean(scores)*100:.2f}%")
        
        self.model.fit(X_train, y_train)
        
        os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
        joblib.dump(self.model, MODEL_PATH)
        logger.info("Success: AI Error Predictor Model trained and saved.")

    def predict(self, xml_content: str) -> Dict[str, Any]:
        """
        Analyzes XML and returns structured JSON with error detection probabilities.
        """
        try:
            # 1. Feature Extraction
            try:
                root = ET.fromstring(xml_content)
                f = extract_features(root)
                unmatched = 0
            except Exception:
                # Fallback to robust broken extraction if parse fails
                f = robust_extract_broken(xml_content)
                unmatched = f.get("unmatched_tags", 1)

            # Map features to vector
            vector = [
                f.get("total_tags", 0),
                f.get("unique_tags_count", f.get("total_tags", 5) // 2),
                f.get("attributes_count", 0),
                f.get("empty_nodes_count", 0),
                f.get("max_depth", 3),
                f.get("relationship_pairs", f.get("total_tags", 5) - 1),
                f.get("avg_attributes_per_tag", 0.5),
                unmatched
            ]

            # 2. ML Inference
            pred_class = int(self.model.predict([vector])[0])
            probs = self.model.predict_proba([vector])[0]
            confidence = float(np.max(probs))

            severity_map = {0: "none", 1: "low", 2: "medium", 3: "high"}
            issue_map = {
                0: "stable_structure",
                1: "logical_data_gaps",
                2: "complex_nesting_irregularity",
                3: "syntax_violation_or_unclosed_tags"
            }

            return {
                "error_detected": bool(pred_class > 0),
                "confidence": round(confidence, 2),
                "predicted_issue": issue_map[pred_class],
                "severity": severity_map[pred_class],
                "features_analyzed": f
            }

        except Exception as e:
            logger.error(f"Prediction failed: {e}")
            return {
                "error_detected": True,
                "confidence": 0.5,
                "predicted_issue": "unknown_processing_error",
                "severity": "medium"
            }
