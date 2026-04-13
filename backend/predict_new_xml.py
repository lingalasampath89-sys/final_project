"""
PROCESS NEW XML FILE
Runs complete AI pipeline
"""

import os

from core.xml_parser import parse_xml
from core.feature_extractor import extract_features
from core.structure_learning import learn_structure
from core.datatype_detector import detect_datatypes
from core.anomaly_detector import detect_anomalies
from core.missing_tag_predictor import predict_missing_tags
from core.missing_value_predictor import predict_missing_values
from core.schema_generator import generate_schema
from core.xml_validator import validate_xml
from core.xml_to_json import convert_xml_to_json, save_json
from core.report_generator import generate_report


INPUT_FOLDER = "data/new_xml"
OUTPUT_JSON = "outputs/parsed/parsed_data.json"


def process_xml(xml_file):

    print("\nProcessing XML:", xml_file)

    # parse xml
    root = parse_xml(xml_file)

    # extract features
    features = extract_features(root)

    # structure learning
    structure = learn_structure(root)

    # datatype detection
    datatypes = detect_datatypes(root)

    # anomaly detection
    anomalies = detect_anomalies(features)

    # missing tag prediction
    missing_tags = predict_missing_tags(features)

    # missing value prediction
    missing_values = predict_missing_values(root)

    # generate schema
    xsd_file = generate_schema(root)

    # validation
    validation_status = validate_xml(xml_file, xsd_file)

    # xml → json
    json_data = convert_xml_to_json(xml_file)
    save_json(json_data, OUTPUT_JSON)

    # report generation
    report_data = {
        "file": xml_file,
        "structure": structure,
        "datatypes": datatypes,
        "anomalies": anomalies,
        "missing_tags": missing_tags,
        "missing_values": missing_values,
        "validation_status": validation_status
    }
    
    report = generate_report(report_data)

    print("\nXML processing completed\n")


def main():

    print("\n===================================")
    print("AI XML PROCESSING STARTED")
    print("===================================\n")

    if not os.path.exists(INPUT_FOLDER):
        print("New XML folder missing")
        return

    files = os.listdir(INPUT_FOLDER)

    if len(files) == 0:
        print("No XML files found in new_xml folder")
        return

    for file in files:

        if file.endswith(".xml"):

            path = os.path.join(INPUT_FOLDER, file)

            process_xml(path)

    print("\n===================================")
    print("ALL XML FILES PROCESSED")
    print("===================================\n")


if __name__ == "__main__":
    main()