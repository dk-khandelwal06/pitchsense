"""
Download and extract Cricsheet IPL JSON dataset.
Dataset source: https://cricsheet.org/downloads/ipl_json.zip
License: Open Data Commons Attribution License (ODC-By) v1.0
"""
import os
import zipfile
import requests
from pathlib import Path

CRICSHEET_IPL_ZIP_URL = "https://cricsheet.org/downloads/ipl_json.zip"
RAW_DATA_DIR = Path("data/raw")
ZIP_PATH = RAW_DATA_DIR / "ipl_json.zip"
EXTRACT_DIR = RAW_DATA_DIR / "ipl_matches"

def download_cricsheet_data():
    RAW_DATA_DIR.mkdir(parents=True, exist_ok=True)
    EXTRACT_DIR.mkdir(parents=True, exist_ok=True)

    if not ZIP_PATH.exists():
        print(f"Downloading Cricsheet IPL JSON dataset from {CRICSHEET_IPL_ZIP_URL}...")
        response = requests.get(CRICSHEET_IPL_ZIP_URL, stream=True, timeout=30)
        response.raise_for_status()
        with open(ZIP_PATH, "wb") as f:
            for chunk in response.iter_content(chunk_size=1024 * 64):
                if chunk:
                    f.write(chunk)
        print(f"Saved to {ZIP_PATH} ({os.path.getsize(ZIP_PATH)} bytes)")
    else:
        print(f"Zip archive already exists at {ZIP_PATH}")

    # Extract
    print(f"Extracting zip archive to {EXTRACT_DIR}...")
    with zipfile.ZipFile(ZIP_PATH, "r") as zip_ref:
        zip_ref.extractall(EXTRACT_DIR)

    json_files = list(EXTRACT_DIR.glob("*.json"))
    print(f"Extracted {len(json_files)} match files.")
    return EXTRACT_DIR

if __name__ == "__main__":
    download_cricsheet_data()

