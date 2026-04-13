import logging
import re
from typing import Dict, Any

logging.basicConfig(level=logging.INFO)


class DataTypeDetector:

    def __init__(self, root):

        self.root = root
        self.results: Dict[str, str] = {}

    def detect_numeric(self, value: str) -> bool:

        try:
            float(value)
            return True
        except:
            return False

    def detect_integer(self, value: str) -> bool:

        if re.match(r"^-?\d+$", value):
            return True
        return False

    def detect_float(self, value: str) -> bool:

        if re.match(r"^-?\d+\.\d+$", value):
            return True
        return False

    def detect_boolean(self, value: str) -> bool:

        if value.lower() in ["true", "false", "yes", "no"]:
            return True
        return False

    def detect_date(self, value: str) -> bool:

        date_patterns = [
            r"\d{4}-\d{2}-\d{2}",
            r"\d{2}/\d{2}/\d{4}",
            r"\d{2}-\d{2}-\d{2024}"
        ]

        for pattern in date_patterns:

            if re.match(pattern, value):
                return True

        return False

    def infer_type(self, value: str) -> str:

        if value is None:
            return "null"

        value = value.strip()

        if value == "":
            return "empty"

        if self.detect_integer(value):
            return "integer"

        if self.detect_float(value):
            return "float"

        if self.detect_boolean(value):
            return "boolean"

        if self.detect_date(value):
            return "date"

        if self.detect_numeric(value):
            return "number"

        return "string"

    def analyze_xml(self):

        for elem in self.root.iter():

            if elem.text:

                text = elem.text.strip()

                if text:

                    dtype = self.infer_type(text)

                    self.results[elem.tag] = dtype

    def analyze_attributes(self):

        for elem in self.root.iter():

            for attr, value in elem.attrib.items():

                dtype = self.infer_type(value)

                key = f"{elem.tag}.{attr}"

                self.results[key] = dtype

    def generate_report(self) -> Dict[str, Any]:

        self.analyze_xml()

        self.analyze_attributes()

        logging.info("Datatype detection completed")

        return self.results


def detect_datatypes(root):

    detector = DataTypeDetector(root)

    return detector.generate_report()