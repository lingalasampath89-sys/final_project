import logging
from typing import Dict, Any

logging.basicConfig(level=logging.INFO)


class MissingValuePredictor:

    def __init__(self, root, raw_xml=""):

        self.root = root
        self.raw_xml = raw_xml
        self.missing_nodes = []
        from collections import defaultdict
        self.tag_values = defaultdict(list)
        self.attr_values = defaultdict(list)

    def _get_line_number(self, tag: str) -> str:
        if not self.raw_xml: return "Unknown"
        import re
        match = re.search(f"<{tag}[>\\s]", self.raw_xml)
        if match:
            return str(self.raw_xml[:match.start()].count("\n") + 1)
        return "Unknown"

    def find_missing_values(self):

        for elem in self.root.iter():

            if elem.text is None or elem.text.strip() == "":

                node = {
                    "tag": elem.tag,
                    "status": "missing_value",
                    "line": self._get_line_number(elem.tag)
                }

                self.missing_nodes.append(node)

    def analyze_attributes(self):

        for elem in self.root.iter():

            for attr, value in elem.attrib.items():

                if value is None or value.strip() == "":

                    node = {
                        "tag": elem.tag,
                        "attribute": attr,
                        "status": "missing_attribute_value",
                        "line": self._get_line_number(elem.tag)
                    }

                    self.missing_nodes.append(node)

    def analyze_common_values(self):

        for elem in self.root.iter():
            if elem.text and elem.text.strip():
                self.tag_values[elem.tag].append(elem.text.strip())

            for attr, val in elem.attrib.items():
                if val and val.strip():
                    self.attr_values[(elem.tag, attr)].append(val.strip())

    def predict_replacement(self):

        predictions = []
        from collections import Counter

        for node in self.missing_nodes:

            tag = node["tag"]
            
            if "attribute" in node:
                key = (tag, node["attribute"])
                vals = self.attr_values[key]
            else:
                vals = self.tag_values[tag]

            if vals:
                counter = Counter(vals)
                most_common, count = counter.most_common(1)[0]
                prob = round((count / len(vals)) * 100, 2)
                node["suggested_value"] = most_common
                node["probability"] = f"{prob}%"
                node["confidence_score"] = prob
            else:
                suggestion = f"default_{tag}"
                node["suggested_value"] = suggestion
                node["probability"] = "Low (10.0%)"
                node["confidence_score"] = 10.0

            predictions.append(node)

        return predictions

    def build_prediction(self) -> Dict[str, Any]:

        self.find_missing_values()
        self.analyze_attributes()
        self.analyze_common_values()

        results = self.predict_replacement()

        logging.info("Missing value prediction completed")

        return {
            "total_missing": len(results),
            "details": results
        }


def predict_missing_values(root, raw_xml=""):

    predictor = MissingValuePredictor(root, raw_xml)

    return predictor.build_prediction()