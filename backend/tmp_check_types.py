
import re
from collections import defaultdict, Counter
import xml.etree.ElementTree as ET

def test_structural_grooming(raw_xml: str):
    xml_content: str = str(raw_xml).strip()
    tag_pattern = re.compile(r'<(/?)([a-zA-Z0-9_]+)(?:\s+[^>]*)?>')
    stack = []
    new_xml = ""
    last_pos = 0
    
    for match in tag_pattern.finditer(xml_content):
        is_closing = match.group(1) == "/"
        tag_name = match.group(2)
        start, end = match.span()
        
        print(f"DEBUG: last_pos={last_pos}, type={type(last_pos)}")
        print(f"DEBUG: start={start}, type={type(start)}")
        
        gap_text = xml_content[last_pos:start]
        print(f"DEBUG: gap_text length={len(gap_text)}")
        
        last_pos = end

test_structural_grooming("<root><child>data</child></root>")
