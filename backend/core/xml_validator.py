import logging

logging.basicConfig(level=logging.INFO)


class XMLValidator:

    def __init__(self, root):

        self.root = root

        self.errors = []

    def check_tag_naming_rules(self):

        import re
        # Standard XML: tags can't start with numbers or punctuation (except _) 
        # and can't contain spaces.
        valid_tag_pattern = re.compile(r'^[a-zA-Z_][a-zA-Z0-9_\-\.]*$')

        for elem in self.root.iter():

            # Remove namespace if present for validation
            tag_name = elem.tag.split('}')[-1] if '}' in elem.tag else elem.tag

            if not valid_tag_pattern.match(tag_name):

                self.errors.append({
                    "tag": elem.tag,
                    "issue": "invalid_tag_name_syntax"
                })

    def check_duplicate_children(self):

        for parent in self.root.iter():

            seen = set()

            for child in parent:

                if child.tag in seen:

                    self.errors.append({
                        "tag": child.tag,
                        "issue": "duplicate_child"
                    })

                seen.add(child.tag)

    def check_attributes(self):

        for elem in self.root.iter():

            for attr, val in elem.attrib.items():

                if val.strip() == "":

                    self.errors.append({
                        "tag": elem.tag,
                        "attribute": attr,
                        "issue": "empty_attribute"
                    })

    def validate(self):

        self.check_tag_naming_rules()

        self.check_duplicate_children()

        self.check_attributes()

        logging.info("XML validation completed")

        return {
            "total_errors": len(self.errors),
            "errors": self.errors
        }


def validate_xml(root):

    validator = XMLValidator(root)

    return validator.validate()