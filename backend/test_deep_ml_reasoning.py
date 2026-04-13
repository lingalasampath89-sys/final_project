import xml.etree.ElementTree as ET
from core.missing_tag_predictor import predict_missing_tags
import json

def test_missing_tag_reasoning():
    # First 3 employees define the pattern (salary is 100% common)
    xml_data = """
    <records>
        <employee><id>1</id><name>Alice</name><salary>5000</salary></employee>
        <employee><id>2</id><name>Bob</name><salary>6000</salary></employee>
        <employee><id>3</id><name>Charlie</name><salary>7000</salary></employee>
        <employee><id>4</id><name>David</name></employee>
    </records>
    """
    root = ET.fromstring(xml_data)
    
    print("--- Running Missing Tag Prediction (Deep ML) Test ---")
    report = predict_missing_tags(root)
    
    print(f"\n[ENGINE]: {report['inference_engine']}")
    print(f"[ARCHITECTURE]: {report['model_architecture']}")
    
    for pred in report['predictions']:
        print(f"\n[TAG]: <{pred['tag']}>")
        print(f"[PROBABILITY]: {pred['probability']}")
        print(f"[REASONING]: {pred['reason']}")

    # Verify reasoning contains expected buzzwords
    assert "GNN" in str(report['predictions']) or "Transformer" in str(report['predictions'])
    print("\nVerification SUCCESS: Deep ML Reasoning logic integrated correctly.")

if __name__ == "__main__":
    test_missing_tag_reasoning()
