#!/usr/bin/env python3
"""Update image URLs for new Phase 1-3 titles."""
import json

# Image URL mappings
IMAGE_UPDATES = {
    "31": "https://cdn.marvel.com/content/2x/ironman_lob_crd_01_4.jpg",
    "32": "https://cdn.marvel.com/content/2x/theincrediblehulk_lob_crd_03.jpg",
    "33": "https://cdn.marvel.com/content/2x/ironman2_lob_crd_01_4.jpg",
    "34": "https://cdn.marvel.com/content/2x/thor_lob_crd_01_1.jpg",
    "35": "https://cdn.marvel.com/content/2x/captainamericathefirstavenger_lob_crd_01_0.jpg",
    "36": "https://cdn.marvel.com/content/2x/theavengers_lob_crd_03_0.jpg",
    "37": "https://cdn.marvel.com/content/2x/ironman3_lob_crd_01_11.jpg",
    "38": "https://cdn.marvel.com/content/2x/thorthedarkworld_lob_crd_02.jpg",
    "39": "https://cdn.marvel.com/content/2x/captainamericathewintersoldier_lob_crd_01_2.jpg",
    "40": "https://cdn.marvel.com/content/2x/guardiansofthegalaxy_lob_crd_03_0.jpg",
    "41": "https://cdn.marvel.com/content/2x/avengersageofultron_lob_crd_03_0.jpg",
    "42": "https://cdn.marvel.com/content/2x/ant-man_lob_crd_01_9.jpg",
    "43": "https://cdn.marvel.com/content/2x/captainamericacivilwar_lob_crd_01_10.jpg",
    "44": "https://cdn.marvel.com/content/2x/guardiansofthegalaxyvol.2_lob_crd_01_0.jpg",
    "45": "https://cdn.marvel.com/content/2x/captainmarvel_lob_crd_06.jpg",
}

def update_images(filename):
    """Update image URLs in JSON file."""
    with open(filename, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    updated_count = 0
    for item in data['items']:
        key = str(item.get('key', ''))
        if key in IMAGE_UPDATES:
            old_url = item.get('imageUrl', '')
            new_url = IMAGE_UPDATES[key]
            if old_url != new_url:
                item['imageUrl'] = new_url
                updated_count += 1
                print(f"Updated {key}. {item['title']}")
    
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    return updated_count

# Update all JSON files
files = ['watchlist.en.json', 'watchlist.nl.json', 'watchlist.json']
total = 0

for filename in files:
    print(f"\nUpdating {filename}...")
    count = update_images(filename)
    total += count
    print(f"  ✓ Updated {count} image URLs")

print(f"\n✓ Total: {total} image URLs updated across all files")

# Made with Bob
