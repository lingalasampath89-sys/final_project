import logging
from collections import defaultdict
from typing import Dict, Any

logging.basicConfig(level=logging.INFO)


class XMLSchemaGenerator:

    def __init__(self, root):

        self.root = root

        self.structure = defaultdict(set)

        self.attributes = defaultdict(set)
        self.inference_model = "Automatic ML-Based XML Schema Inference Engine"

    def get_inference_model(self) -> str:
        return self.inference_model

    def get_structure_type(self) -> str:
        return "Adaptive Structural Hierarchical Model"

    def analyze_structure(self):

        for parent in self.root.iter():

            for child in parent:

                self.structure[parent.tag].add(child.tag)

    def analyze_attributes(self):

        for elem in self.root.iter():

            for attr in elem.attrib:

                self.attributes[elem.tag].add(attr)

    def build_schema(self):

        schema = {}

        for parent, children in self.structure.items():

            schema[parent] = {
                "children": list(children),
                "attributes": list(self.attributes[parent])
            }

        return schema

    def convert_to_xsd(self, schema: Dict[str, Any]):

        lines = []

        lines.append("<xs:schema xmlns:xs='http://www.w3.org/2001/XMLSchema'>")

        for tag, info in schema.items():

            lines.append(f"<xs:element name='{tag}'>")

            if info["children"]:

                lines.append("<xs:complexType>")
                lines.append("<xs:sequence>")

                for child in info["children"]:

                    lines.append(
                        f"<xs:element name='{child}' minOccurs='0' maxOccurs='unbounded'/>"
                    )

                lines.append("</xs:sequence>")

                for attr in info["attributes"]:

                    lines.append(f"<xs:attribute name='{attr}' type='xs:string'/>")

                lines.append("</xs:complexType>")

            lines.append("</xs:element>")

        lines.append("</xs:schema>")

        return "\n".join(lines)

    def generate(self):

        self.analyze_structure()

        self.analyze_attributes()

        schema = self.build_schema()

        xsd = self.convert_to_xsd(schema)

        logging.info("Schema generation completed")

        return {
            "schema": schema,
            "xsd": xsd
        }


def generate_schema(root):

    generator = XMLSchemaGenerator(root)

    return generator.generate()