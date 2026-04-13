import logging
import json

logging.basicConfig(level=logging.INFO)


class XMLtoJSONConverter:

    def __init__(self, root):

        self.root = root

    def element_to_dict(self, elem):

        data = {}

        if elem.attrib:
            data["attributes"] = elem.attrib

        children = list(elem)

        if children:

            child_dict = {}

            for child in children:

                child_dict[child.tag] = self.element_to_dict(child)

            data["children"] = child_dict

        else:

            if elem.text:
                data["value"] = elem.text.strip()

        return data

    def convert(self):

        result = {
            self.root.tag: self.element_to_dict(self.root)
        }

        logging.info("XML to JSON conversion completed")

        return result

    def convert_to_string(self):

        json_data = self.convert()

        return json.dumps(json_data, indent=2)


def xml_to_json(root):

    converter = XMLtoJSONConverter(root)

    return converter.convert()