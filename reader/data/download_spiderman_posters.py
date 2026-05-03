#!/usr/bin/env python3
"""
Download poster images for Spider-Man films.
"""

import requests
from pathlib import Path

def download_image(url, filename):
    """Download an image from URL and save it."""
    try:
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        
        # Save to images directory
        images_dir = Path(__file__).parent.parent / "images"
        images_dir.mkdir(exist_ok=True)
        
        filepath = images_dir / filename
        with open(filepath, 'wb') as f:
            f.write(response.content)
        
        print(f"✓ Downloaded: {filename}")
        return True
    except Exception as e:
        print(f"✗ Failed to download {filename}: {e}")
        return False

def main():
    """Download all Spider-Man poster images."""
    
    posters = {
        "SM1.jpg": "https://cdn.marvel.com/content/2x/spider-man_lob_crd_01.jpg",
        "SM2.jpg": "https://cdn.marvel.com/content/2x/spider-man2_lob_crd_01.jpg",
        "SM3.jpg": "https://cdn.marvel.com/content/2x/spider-man3_lob_crd_01.jpg",
        "TASM1.jpg": "https://cdn.marvel.com/content/2x/theamazingspider-man_lob_crd_01.jpg"
    }
    
    print("Downloading Spider-Man poster images...\n")
    
    success_count = 0
    for filename, url in posters.items():
        if download_image(url, filename):
            success_count += 1
    
    print(f"\n✓ Downloaded {success_count}/{len(posters)} images successfully!")

if __name__ == "__main__":
    main()

# Made with Bob
