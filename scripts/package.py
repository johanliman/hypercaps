import os
import zipfile

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
DIST_DIR = os.path.join(BASE_DIR, 'dist')
BACKEND_DIR = os.path.join(BASE_DIR, 'backend')
OUTPUT_ZIP = os.path.join(BASE_DIR, 'upload_to_htdocs.zip')

if not os.path.exists(DIST_DIR):
    raise SystemExit("Error: dist/ directory not found. Please run 'npm run build' first.")

if not os.path.exists(BACKEND_DIR):
    raise SystemExit("Error: backend/ directory not found.")

print(f"Building {OUTPUT_ZIP}...")

# Remove existing zip if any
if os.path.exists(OUTPUT_ZIP):
    os.remove(OUTPUT_ZIP)

with zipfile.ZipFile(OUTPUT_ZIP, 'w', zipfile.ZIP_DEFLATED) as zipf:
    # Add files from dist/ to the root of the archive
    for root, dirs, files in os.walk(DIST_DIR):
        for file in files:
            if file == '.DS_Store':
                continue
            abs_path = os.path.join(root, file)
            rel_path = os.path.relpath(abs_path, DIST_DIR)
            zipf.write(abs_path, rel_path)
            print(f"  + {rel_path}")

    # Add files from backend/ under 'backend/'
    for root, dirs, files in os.walk(BACKEND_DIR):
        for file in files:
            if file == '.DS_Store':
                continue
            abs_path = os.path.join(root, file)
            rel_path = os.path.join('backend', os.path.relpath(abs_path, BACKEND_DIR))
            zipf.write(abs_path, rel_path)
            print(f"  + {rel_path}")

size_kb = os.path.getsize(OUTPUT_ZIP) / 1024
print(f"\nDone! Successfully created upload_to_htdocs.zip ({size_kb:.1f} KB)")
