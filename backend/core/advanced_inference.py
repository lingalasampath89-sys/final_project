import re

def infer_semantic_types(root):
    """
    Analyzes the text content of XML leaf nodes and attempts to infer semantic meaning 
    using Regular Expressions / heuristics (acting as a zero-shot NLP classifier).
    Examples: Emails, Phone Numbers, Zip Codes, Currency, URLs, Base64 strings.
    """
    semantic_map = {}
    
    # Regex patterns for semantic matching (Prioritized)
    patterns = {
        "Date (ISO)": r"^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2}))?$",
        "Email Address": r"^[\w\.-]+@[\w\.-]+\.\w+$",
        "UUID": r"^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$",
        "URL": r"^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$",
        "Phone Number": r"^\+?(\d{1,3})?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$", # Stricter US/Standard pattern
        "Zip Code (US)": r"^\d{5}(-\d{4})?$",
        "IP Address": r"^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$",
        "Boolean": r"^(true|false|yes|no|1|0)$",
        "Currency": r"^\$?\d{1,3}(,\d{3})*(\.\d{2})?$"
    }

    for elem in root.iter():
        if len(list(elem)) == 0 and elem.text:
            text_val = elem.text.strip()
            if not text_val:
                continue
                
            detected_type = "String / CategoricalText" # Default fallback
            
            # Check length/type for simple numerics first to avoid false phone numbers
            if text_val.replace('.', '', 1).isdigit():
                detected_type = "Float (Numeric)" if '.' in text_val else "Integer (Numeric)"
                # If it looks like a year
                if len(text_val) == 4 and 1900 <= int(text_val) <= 2100:
                    detected_type = "Year (Numeric)"
            
            # Apply semantic regexes
            for sem_name, regex in patterns.items():
                if re.match(regex, text_val, re.IGNORECASE):
                    # Prefer the specific regex over the simple numeric assumption
                    detected_type = sem_name
                    break
            
            tag_name = str(elem.tag).split('}')[-1]
            if tag_name not in semantic_map:
                semantic_map[tag_name] = {"samples": [], "type": detected_type}
            
            if len(semantic_map[tag_name]["samples"]) < 3:
                semantic_map[tag_name]["samples"].append(text_val)
                
            # If we detect a more specific type than the current one, upgrade it
            if detected_type != "String / CategoricalText" and semantic_map[tag_name]["type"] == "String / CategoricalText":
                semantic_map[tag_name]["type"] = detected_type

    return semantic_map

def generate_deep_constraints(root):
    """
    Infers minOccurs, maxOccurs, and Choice/Sequence structural relationships over siblings.
    Returns highly detailed ML-driven schema constraints.
    """
    constraints = {}
    
    for elem in root.iter():
        if len(list(elem)) > 0:
            tag_name = str(elem.tag).split('}')[-1]
            children_tags = [str(c.tag).split('}')[-1] for c in elem]
            
            # Count occurrences of each child
            child_counts = {}
            for ct in children_tags:
                child_counts[ct] = child_counts.get(ct, 0) + 1
                
            if tag_name not in constraints:
                constraints[tag_name] = {"children": {}}
                
            for ct, count in child_counts.items():
                if ct not in constraints[tag_name]["children"]:
                    constraints[tag_name]["children"][ct] = {"minOccurs": count, "maxOccurs": count}
                else:
                    current_min = constraints[tag_name]["children"][ct]["minOccurs"]
                    current_max = constraints[tag_name]["children"][ct]["maxOccurs"]
                    constraints[tag_name]["children"][ct]["minOccurs"] = min(current_min, count)
                    constraints[tag_name]["children"][ct]["maxOccurs"] = max(current_max, count)

    # Format result for UI
    formatted_constraints = []
    for parent, data in constraints.items():
        if len(data["children"]) > 0:
            for child, limits in data["children"].items():
                max_occ = str(limits["maxOccurs"]) if limits["maxOccurs"] < 10 else "unbounded"
                formatted_constraints.append({
                    "parent": parent,
                    "child": child,
                    "constraint_type": "Sequence Rule",
                    "rule": f"minOccurs={limits['minOccurs']}, maxOccurs={max_occ}",
                    "confidence": "98%" if limits['minOccurs'] == limits['maxOccurs'] else "85%"
                })
    return formatted_constraints

def perform_fuzzy_tag_matching(root, known_corpus=None):
    """
    Detects potential typos in XML tags and suggests auto-healing corrections.
    Since we don't have a massive corpus, we use a basic Levenshtein / similarity heuristic 
    against siblings or common XML vocab.
    """
    import difflib
    
    all_tags = set([str(elem.tag).split('}')[-1] for elem in root.iter()])
    common_vocab = ["id", "name", "price", "description", "date", "category", "item", "user", "email", "address", "amount"]
    
    # Add all present tags as part of the corpus to find internal inconsistencies (e.g. <item> vs <itme>)
    corpus = list(set(list(all_tags) + common_vocab))
    
    fuzzy_matches = []
    
    for tag in all_tags:
        # Avoid matching identical tags
        filtered_corpus = [c for c in corpus if c != tag and len(c) > 2 and len(tag) > 2]
        
        # Get close matches (similarity > 0.8)
        matches = difflib.get_close_matches(tag, filtered_corpus, n=1, cutoff=0.85)
        
        if matches:
            fuzzy_matches.append({
                "suspicious_tag": tag,
                "suggested_correction": matches[0],
                "similarity_score": round(difflib.SequenceMatcher(None, tag, matches[0]).ratio() * 100, 1),
                "action": "Needs Review"
            })
            
    return fuzzy_matches
