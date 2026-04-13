from core.repair_engine import run_advanced_repair
import json

def test_screenshot_fix():
    # XML matching the screenshot (unclosed root, empty last_updated)
    screenshot_xml = """<root><data id="101"><item_name>SmartAI Pro</item_name>
    <category>Software</category>
    <price currency="USD">499.00</price>
    <stock_info><available>true</available>
        <last_updated></last_updated>
    </stock_info>
</data>"""
    
    print("--- Running Screenshot XML Fix Test ---")
    results = run_advanced_repair(screenshot_xml)
    
    print("\n[CORRECTED XML]")
    print(results['corrected_xml'])
    
    # Check if last_updated is filled with a date
    import re
    assert re.search(r'<last_updated>\d{4}-\d{2}-\d{2}', results['corrected_xml'])
    
    # Check if 'available' (if missing/empty) becomes 'true'
    # In the screenshot it was true, but let's test a case where it's empty
    empty_available_xml = "<root><item><available></available></item></root>"
    res2 = run_advanced_repair(empty_available_xml)
    assert "<available>true</available>" in res2['corrected_xml']

    print("\nVerification SUCCESS: 'available' predicted as 'true' and dates are formatted.")

if __name__ == "__main__":
    test_screenshot_fix()
