const UPLOAD_API = "http://localhost:8000/upload_xml";
const PROCESS_API = "http://localhost:8000/process_xml";
const BASE_API = "http://localhost:8000";

export async function uploadXmlFile(file: File | Blob, filename: string) {
  const formData = new FormData();
  formData.append("file", file, filename);

  const response = await fetch(UPLOAD_API, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(err);
  }

  return await response.json();
}

export async function processXmlFile(filename: string) {
  const response = await fetch(`${PROCESS_API}?filename=${encodeURIComponent(filename)}`, {
    method: "POST",
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(err);
  }

  return await response.json();
}

export async function autoFixXmlFile(filename: string) {
  const url = `${BASE_API}/auto_fix_xml?filename=${encodeURIComponent(filename)}`;
  const response = await fetch(url, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(`Auto-fix failed: ${response.statusText}`);
  }

  return await response.json();
}