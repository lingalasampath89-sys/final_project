import os
import random
import string
import xml.etree.ElementTree as ET
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
TRAIN_DIR = os.path.join(BASE_DIR, "data", "training_xml")

os.makedirs(TRAIN_DIR, exist_ok=True)

# -----------------------------
# Random data generators
# -----------------------------

first_names = ["John","Jane","Robert","Emily","Michael","Sarah","David","Laura","Chris","Sophia"]
last_names = ["Smith","Johnson","Williams","Brown","Jones","Garcia","Miller","Davis"]
departments = ["HR","Finance","Engineering","Marketing","Sales","IT"]
diagnosis = ["Flu","Cold","COVID","Diabetes","Asthma","Allergy"]

def rand_name():
    return random.choice(first_names) + " " + random.choice(last_names)

def rand_email(name):
    return name.replace(" ",".").lower() + "@example.com"

def rand_phone():
    return "+1" + "".join(random.choices(string.digits,k=10))

def rand_price():
    return round(random.uniform(10,500),2)

def rand_date():
    return datetime.now().strftime("%Y-%m-%d")

def rand_id(prefix):
    return prefix + str(random.randint(1000,9999))

# -----------------------------
# XML creators
# -----------------------------

def create_invoice_xml(index, anomaly=False, missing=False):
    root = ET.Element("Invoice")
    ET.SubElement(root,"InvoiceID").text = rand_id("INV")

    if not missing:
        ET.SubElement(root,"Date").text = rand_date()

    customer = ET.SubElement(root,"Customer")
    name = rand_name()
    ET.SubElement(customer,"Name").text = name
    ET.SubElement(customer,"Email").text = rand_email(name)

    items = ET.SubElement(root,"Items")

    for i in range(random.randint(1,5)):
        item = ET.SubElement(items,"Item")
        ET.SubElement(item,"Product").text = "Product_" + str(random.randint(1,50))
        ET.SubElement(item,"Quantity").text = str(random.randint(1,10))
        ET.SubElement(item,"Price").text = str(rand_price())

    total = ET.SubElement(root,"Total")
    if anomaly:
        total.text = "INVALID_NUMBER"
    else:
        total.text = str(rand_price()*3)

    return ET.ElementTree(root)

def create_employee_xml(index, anomaly=False, missing=False):
    root = ET.Element("Employee")

    ET.SubElement(root,"EmployeeID").text = rand_id("EMP")

    if not missing:
        name = rand_name()
        ET.SubElement(root,"Name").text = name
        ET.SubElement(root,"Email").text = rand_email(name)

    ET.SubElement(root,"Department").text = random.choice(departments)
    ET.SubElement(root,"Salary").text = str(random.randint(30000,120000))

    if anomaly:
        ET.SubElement(root,"Age").text = "ABC"

    else:
        ET.SubElement(root,"Age").text = str(random.randint(21,60))

    return ET.ElementTree(root)

def create_medical_xml(index, anomaly=False, missing=False):
    root = ET.Element("MedicalRecord")

    ET.SubElement(root,"PatientID").text = rand_id("PAT")

    if not missing:
        name = rand_name()
        ET.SubElement(root,"PatientName").text = name

    ET.SubElement(root,"Diagnosis").text = random.choice(diagnosis)
    ET.SubElement(root,"VisitDate").text = rand_date()

    if anomaly:
        ET.SubElement(root,"HeartRate").text = "ERROR"
    else:
        ET.SubElement(root,"HeartRate").text = str(random.randint(60,120))

    return ET.ElementTree(root)

# -----------------------------
# Write XML files
# -----------------------------

def save_xml(tree, name):
    path = os.path.join(TRAIN_DIR, name)
    tree.write(path, encoding="utf-8", xml_declaration=True)

# -----------------------------
# Dataset generation
# -----------------------------

def generate_dataset():

    total_files = 5000

    print("Generating XML dataset...")

    for i in range(total_files):

        anomaly = random.random() < 0.05
        missing = random.random() < 0.05

        doc_type = random.choice(["invoice","employee","medical"])

        if doc_type == "invoice":
            tree = create_invoice_xml(i, anomaly, missing)
            filename = f"invoice_{i}.xml"

        elif doc_type == "employee":
            tree = create_employee_xml(i, anomaly, missing)
            filename = f"employee_{i}.xml"

        else:
            tree = create_medical_xml(i, anomaly, missing)
            filename = f"medical_{i}.xml"

        save_xml(tree, filename)

    print("Dataset generation completed.")
    print("Total XML files created:", total_files)
    print("Location:", TRAIN_DIR)

# -----------------------------
# Advanced anomalies generator
# -----------------------------

def generate_extra_anomalies():

    for i in range(100):

        root = ET.Element("CorruptedXML")

        ET.SubElement(root,"RandomTag").text = "###"
        ET.SubElement(root,"BrokenValue").text = "NaN"
        ET.SubElement(root,"StrangeData").text = "???"

        tree = ET.ElementTree(root)

        save_xml(tree,f"anomaly_{i}.xml")

    print("Extra anomaly files generated.")

# -----------------------------
# Main
# -----------------------------

if __name__ == "__main__":

    generate_dataset()

    generate_extra_anomalies()

    print("XML training dataset ready.")