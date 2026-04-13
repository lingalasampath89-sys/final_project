import logging
import re
from typing import Dict, Any, List, Set, Tuple
import xml.etree.ElementTree as ET

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("FeatureExtractor")

class FeatureExtractor:
    def __init__(self, root: ET.Element):
        self.root = root
        self.features = {
            "total_tags": 0,
            "unique_tags_count": 0,
            "attributes_count": 0,
            "text_nodes_count": 0,
            "max_depth": 0,
            "empty_nodes_count": 0,
            "tag_frequencies": {},
            "relationship_pairs": 0,
            "avg_attributes_per_tag": 0.0
        }

    def extract_all(self) -> Dict[str, Any]:
        if self.root is None:
            return self.features

        tags_list = []
        depths = []
        relationships: Set[Tuple[str, str]] = set()
        
        def traverse(node, current_depth):
            self.features["total_tags"] += 1
            tag = node.tag
            tags_list.append(tag)
            
            # Frequencies
            self.features["tag_frequencies"][tag] = self.features["tag_frequencies"].get(tag, 0) + 1
            
            # Attributes
            self.features["attributes_count"] += len(node.attrib)
            
            # Empty nodes
            if (node.text is None or not node.text.strip()) and len(node) == 0:
                self.features["empty_nodes_count"] += 1
                
            # Text nodes
            if node.text and node.text.strip():
                self.features["text_nodes_count"] += 1
                
            # Depth tracking
            max_d = current_depth
            for child in node:
                relationships.add((node.tag, child.tag))
                child_max_d = traverse(child, current_depth + 1)
                max_d = max(max_d, child_max_d)
            return max_d

        self.features["max_depth"] = traverse(self.root, 1)
        self.features["unique_tags_count"] = len(self.features["tag_frequencies"])
        self.features["relationship_pairs"] = len(relationships)
        
        if self.features["total_tags"] > 0:
            self.features["avg_attributes_per_tag"] = self.features["attributes_count"] / self.features["total_tags"]
            
        return self.features

def extract_features(root: ET.Element) -> Dict[str, Any]:
    extractor = FeatureExtractor(root)
    return extractor.extract_all()

def robust_extract_broken(xml_content: str) -> Dict[str, Any]:
    """
    Extracts features even from broken XML using regex.
    Useful for 'Missing or unmatched closing tags' prediction.
    """
    features = {
        "total_tags": 0,
        "attributes_count": 0,
        "empty_nodes_count": 0,
        "unmatched_tags": 0,
        "max_depth": 0 # Hard to guess without real structure
    }
    
    # Simple tag counting
    opening_tags = re.findall(r'<([^/!?>\s]+)', xml_content)
    closing_tags = re.findall(r'</([^>]+)>', xml_content)
    all_tags = opening_tags + closing_tags
    
    features["total_tags"] = len(opening_tags)
    
    # Attributes heuristic
    attr_matches = re.findall(r'\s+([a-zA-Z_:][-a-zA-Z0-9._:]*)\s*=', xml_content)
    features["attributes_count"] = len(attr_matches)
    
    # Unmatched tags count
    tag_balance = {}
    for t in opening_tags:
        tag_balance[t] = tag_balance.get(t, 0) + 1
    for t in closing_tags:
        tag_balance[t] = tag_balance.get(t, 0) - 1
        
    features["unmatched_tags"] = sum(abs(v) for v in tag_balance.values())
    
    # Self-closing tags
    self_closing = re.findall(r'<[^>]+/>', xml_content)
    features["empty_nodes_count"] = len(self_closing)
    
    return features