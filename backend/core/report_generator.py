import logging
from typing import Dict, Any

logging.basicConfig(level=logging.INFO)


class XMLReportGenerator:

    def __init__(self):

        self.report = {}

    def add_section(self, name: str, data: Any):

        self.report[name] = data

    def summarize(self) -> Dict[str, Any]:
        summary: Dict[str, Any] = {}
        
        # Flatten metadata
        if "metadata" in self.report and isinstance(self.report["metadata"], dict):
            for k, v in self.report["metadata"].items():
                summary[k] = v
        
        # Extract specific counts
        for key, value in self.report.items():
            if key == "anomalies" and isinstance(value, dict):
                summary["anomalies"] = value.get("total_anomalies", 0)
            elif key == "missing_tags" and isinstance(value, dict):
                summary["missing_tags"] = value.get("total_missing_tags", 0)
            elif key == "missing_values" and isinstance(value, dict):
                summary["missing_values"] = value.get("total_missing", 0)
            elif key == "validation" and isinstance(value, dict):
                summary["validation_errors"] = len(value.get("errors", []))
            elif key in ["parsing_model", "inference_model", "structure_observed"]:
                summary[key] = value
                
        # Fallback for anything else
        for key, value in self.report.items():
            if key not in summary and key != "metadata":
                if isinstance(value, (int, float, str)):
                    summary[key] = value
        
        return summary

    def generate_final_report(self):

        summary = self.summarize()

        final = {
            "summary": summary,
            "details": self.report
        }

        logging.info("Report generation completed")

        return final


def generate_report(results: Dict[str, Any]):

    generator = XMLReportGenerator()

    for key, value in results.items():

        generator.add_section(key, value)

    return generator.generate_final_report()