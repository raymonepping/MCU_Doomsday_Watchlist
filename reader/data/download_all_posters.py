#!/usr/bin/env python3
"""
Download all poster images from marvel-images.json to assets/posters directory.
"""

import json
import urllib.request
from pathlib import Path
import time

def download_image(url, filepath):
    """Download an image from URL and save it."""
    try:
        with urllib.request.urlopen(url, timeout=30) as response:
            data = response.read()
            
        with open(filepath, 'wb') as f:
            f.write(data)
        
        return True
    except Exception as e:
        print(f"  ✗ Failed: {e}")
        return False

def main():
    """Download all poster images."""
    
    # Load marvel-images.json
    with open('marvel-images.json', 'r') as f:
        data = json.load(f)
    
    # Get posters directory
    posters_dir = Path(__file__).parent.parent / "assets" / "posters"
    posters_dir.mkdir(parents=True, exist_ok=True)
    
    print("Downloading MCU poster images...")
    print(f"Target directory: {posters_dir}")
    print("=" * 80)
    
    success_count = 0
    skip_count = 0
    fail_count = 0
    
    for key, image_data in sorted(data['images'].items()):
        # Get local filename from localImage path
        local_path = image_data.get('localImage', '')
        if not local_path:
            continue
            
        filename = Path(local_path).name
        filepath = posters_dir / filename
        
        # Skip if already exists
        if filepath.exists():
            print(f"⊙ {filename} - Already exists")
            skip_count += 1
            continue
        
        # Download
        url = image_data.get('imageUrl', '')
        if not url:
            print(f"✗ {filename} - No URL found")
            fail_count += 1
            continue
        
        print(f"↓ {filename} - Downloading...", end=' ')
        if download_image(url, filepath):
            print("✓")
            success_count += 1
            time.sleep(0.5)  # Be nice to Marvel's servers
        else:
            fail_count += 1
    
    print("=" * 80)
    print(f"\n✓ Downloaded: {success_count}")
    print(f"⊙ Skipped (already exist): {skip_count}")
    print(f"✗ Failed: {fail_count}")
    print(f"\nTotal posters: {success_count + skip_count}")

if __name__ == "__main__":
    main()

# Made with Bob