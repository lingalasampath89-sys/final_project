import os
import sys

# Add the backend directory to sys.path to import core modules
sys.path.append(os.path.join(os.getcwd(), "backend"))

from core.xml_parser import parse_xml
from core.structure_learning import learn_structure
from core.datatype_detector import detect_datatypes
from core.schema_generator import generate_schema
from core.xml_validator import validate_xml
from core.anomaly_detector import detect_anomalies
from core.missing_tag_predictor import predict_missing_tags
from core.missing_value_predictor import predict_missing_values
from core.report_generator import generate_report

def test_enhanced_report():
    xml_path = "backend/data/new_xml/workspace_input.xml"
    if not os.path.exists(xml_path):
        print(f"Error: {xml_path} not found.")
        return

    print(f"Testing with file: {xml_path}")
    
    try:
        root = parse_xml(xml_path)
        
        # Simulating api_server.py logic
        structure = learn_structure(root)
        datatypes = detect_datatypes(root)
        validation = validate_xml(root)
        anomalies = detect_anomalies(root)
        missing_tags = predict_missing_tags(root)
        missing_values = predict_missing_values(root)

        report_data = {
            "parsing_model": "Python Standard Library (xml.etree.ElementTree)",
            "inference_model": "Recursive Structural Schema Inference",
            "structure_observed": "Hierarchical Tree with Tag Nesting",
            "structure": structure,
            "datatypes": datatypes,
            "validation": validation,
            "anomalies": anomalies,
            "missing_tags": missing_tags,
            "missing_values": missing_values
        }
        
        report = generate_report(report_data)
        
        print("\n--- Final Report Summary ---")
        for key, value in report['summary'].items():
            print(f"{key}: {value}")
            
        # Assertions
        assert "parsing_model" in report['summary']
        assert report['summary']["parsing_model"] == "Python Standard Library (xml.etree.ElementTree)"
        assert "inference_model" in report['summary']
        assert report['summary']["inference_model"] == "Recursive Structural Schema Inference"
        assert "structure_observed" in report['summary']
        assert report['summary']["structure_observed"] == "Hierarchical Tree with Tag Nesting"
        
        print("\nVerification SUCCESS: All new fields are present in the report.")

    except Exception as e:
        print(f"\nVerification FAILED: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_enhanced_report()
