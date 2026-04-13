from core.repair_engine import run_advanced_repair
import json

def test_clean_root():
    # Test case: XML with empty container and unclosed root
    test_xml = """<root>
    <data id="101">
        <item_name>SmartAI Pro</item_name>
        <stock_info></stock_info>
    </data>"""
    
    print("--- Running Clean Container Test ---")
    results = run_advanced_repair(test_xml)
    
    xml_out = results['corrected_xml']
    print("\n[OUTPUT XML]")
    print(xml_out)
    
    # Check that root remains a container (no text)
    assert "<root>PREDICTED_VALUE" not in xml_out
    # Check that stock_info (a container) remains clean
    assert "<stock_info>PREDICTED_VALUE" not in xml_out
    # Check that root is closed
    assert "</root>" in xml_out

    print("\nVerification SUCCESS: Containers are clean, root is closed.")

if __name__ == "__main__":
    test_clean_root()
