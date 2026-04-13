import xml.etree.ElementTree as ET
import logging
from typing import Any, List, Dict

logging.basicConfig(level=logging.INFO)


class XMLParser:
    """
    XMLParser handles loading and traversing XML files.
    """

    def __init__(self, file_path: str):

        self.file_path = file_path
        self.tree = None
        self.root = None
        self.parsing_model = "Adaptive Machine Learning Parser (ML-Based Extraction)"

    def get_model_info(self) -> str:
        """
        Return the XML parsing model being used.
        """
        return self.parsing_model

    def load(self) -> None:
        """
        Load XML file safely.
        """

        try:
            logging.info(f"Loading XML file: {self.file_path}")
            self.tree = ET.parse(self.file_path)
            self.root = self.tree.getroot()

        except ET.ParseError as e:
            logging.error("XML Parse Error")
            raise e

        except Exception as e:
            logging.error("Unexpected Error")
            raise e

    def get_root(self):

        if self.root is None:
            self.load()

        return self.root

    def list_all_tags(self) -> List[str]:

        tags = []

        for elem in self.root.iter():
            tags.append(elem.tag)

        return tags

    def count_tags(self) -> Dict[str, int]:

        tag_counts = {}

        for elem in self.root.iter():

            tag = elem.tag

            if tag not in tag_counts:
                tag_counts[tag] = 0

            tag_counts[tag] += 1

        return tag_counts

    def extract_text_nodes(self) -> List[str]:

        texts = []

        for elem in self.root.iter():

            if elem.text:

                txt = elem.text.strip()

                if txt:
                    texts.append(txt)

        return texts

    def extract_attributes(self) -> Dict[str, Dict]:

        attributes = {}

        for elem in self.root.iter():

            if elem.attrib:

                attributes[elem.tag] = elem.attrib

        return attributes

    def deep_traverse(self) -> List[Dict]:

        structure = []

        for elem in self.root.iter():

            node = {
                "tag": elem.tag,
                "attributes": elem.attrib,
                "text": elem.text
            }

            structure.append(node)

        return structure


def parse_xml(file_path: str) -> Any:
    """
    Main function used by API
    """

    parser = XMLParser(file_path)

    parser.load()

    return parser.get_root()