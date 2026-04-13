import os

structure_file = "structure.txt"

with open(structure_file, "r") as f:
    lines = f.readlines()

for line in lines:
    path = line.strip()

    if path.endswith("/"):
        os.makedirs(path, exist_ok=True)
    else:
        folder = os.path.dirname(path)
        os.makedirs(folder, exist_ok=True)
        open(path, "a").close()

print("Project structure created successfully!")