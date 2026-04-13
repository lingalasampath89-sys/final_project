import os
import random
import xml.etree.ElementTree as ET

DATASET_DIR = "xml_dataset"

schemas = [
    "order",
    "customer",
    "product",
    "employee",
    "invoice"
]

names = ["John", "Ravi", "Sita", "Arjun", "Priya", "David"]
products = ["Laptop", "Mouse", "Keyboard", "Phone"]
departments = ["IT", "HR", "Finance"]

def create_order():
    root = ET.Element("order")
    ET.SubElement(root, "order_id").text = str(random.randint(1000, 9999))
    ET.SubElement(root, "customer_name").text = random.choice(names)
    ET.SubElement(root, "product").text = random.choice(products)
    ET.SubElement(root, "price").text = str(random.randint(100, 10000))

    if random.random() > 0.3:
        ET.SubElement(root, "quantity").text = str(random.randint(1, 5))

    return root


def create_customer():
    root = ET.Element("customer")
    ET.SubElement(root, "customer_id").text = str(random.randint(100, 999))
    ET.SubElement(root, "name").text = random.choice(names)

    if random.random() > 0.4:
        ET.SubElement(root, "phone").text = str(random.randint(9000000000, 9999999999))

    if random.random() > 0.4:
        ET.SubElement(root, "email").text = "user@example.com"

    return root


def create_product():
    root = ET.Element("product")
    root.set("category", "electronics")

    ET.SubElement(root, "product_id").text = str(random.randint(2000, 5000))
    ET.SubElement(root, "name").text = random.choice(products)
    ET.SubElement(root, "price").text = str(random.randint(500, 50000))

    return root


def create_employee():
    root = ET.Element("employee")

    ET.SubElement(root, "employee_id").text = str(random.randint(300, 800))
    ET.SubElement(root, "name").text = random.choice(names)

    if random.random() > 0.3:
        ET.SubElement(root, "department").text = random.choice(departments)

    ET.SubElement(root, "salary").text = str(random.randint(20000, 90000))

    return root


def create_invoice():
    root = ET.Element("invoice")

    ET.SubElement(root, "invoice_id").text = str(random.randint(9000, 12000))
    ET.SubElement(root, "customer").text = random.choice(names)
    ET.SubElement(root, "amount").text = str(random.randint(1000, 50000))

    if random.random() > 0.5:
        ET.SubElement(root, "date").text = "2024-01-01"

    return root


def create_nested_structure():
    root = ET.Element("company")

    dept = ET.SubElement(root, "department")
    ET.SubElement(dept, "name").text = random.choice(departments)

    emp = ET.SubElement(dept, "employee")
    ET.SubElement(emp, "id").text = str(random.randint(1, 100))
    ET.SubElement(emp, "name").text = random.choice(names)

    return root


def create_anomaly():
    root = ET.Element("order")

    ET.SubElement(root, "order_id").text = "INVALID_ID"
    ET.SubElement(root, "price").text = "ABC"

    return root


generators = [
    create_order,
    create_customer,
    create_product,
    create_employee,
    create_invoice,
    create_nested_structure,
    create_anomaly
]

os.makedirs(DATASET_DIR, exist_ok=True)

for i in range(1000):

    gen = random.choice(generators)

    root = gen()

    tree = ET.ElementTree(root)

    filename = os.path.join(DATASET_DIR, f"xml_{i}.xml")

    tree.write(filename)

print("Dataset generation complete. 1000 XML files created.")