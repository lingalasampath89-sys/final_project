import logging
from collections import defaultdict
from typing import Dict, List

logging.basicConfig(level=logging.INFO)


class StructureLearner:

    def __init__(self, root):

        self.root = root

        self.structure = defaultdict(list)

    def analyze_parent_child(self):

        for parent in self.root.iter():

            for child in parent:

                parent_tag = parent.tag
                child_tag = child.tag

                self.structure[parent_tag].append(child_tag)

    def remove_duplicates(self):

        clean_structure = {}

        for key, values in self.structure.items():

            clean_structure[key] = list(set(values))

        return clean_structure

    def build_graph(self) -> Dict[str, List[str]]:

        self.analyze_parent_child()

        graph = self.remove_duplicates()

        return graph

    def detect_root(self):

        return self.root.tag

    def count_relations(self):

        total = 0

        for parent in self.structure:

            total += len(self.structure[parent])

        return total

    def generate_structure_report(self):

        graph = self.build_graph()

        report = {
            "root": self.detect_root(),
            "relations": self.count_relations(),
            "structure": graph
        }

        logging.info("Structure learning completed")

        return report


def learn_structure(root):

    learner = StructureLearner(root)

    structure = learner.generate_structure_report()

    return structure