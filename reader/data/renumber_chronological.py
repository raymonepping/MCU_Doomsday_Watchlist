#!/usr/bin/env python3
"""
Renumber watchlist items in chronological order.
Iron Man (#1) → Avengers: Doomsday (#45)
"""
import json
import shutil
from pathlib import Path

# Define the correct chronological order
CHRONOLOGICAL_ORDER = [
    # Phase 1 (2008-2012)
    "Iron Man",
    "The Incredible Hulk",
    "Iron Man 2",
    "Thor",
    "Captain America: The First Avenger",
    "The Avengers",
    # Phase 2 (2013-2015)
    "Iron Man 3",
    "Thor: The Dark World",
    "Captain America: The Winter Soldier",
    "Guardians of the Galaxy",
    "Avengers: Age of Ultron",
    "Ant-Man",
    # Phase 3 (2016-2019)
    "Captain America: Civil War",
    "Doctor Strange",
    "Guardians of the Galaxy Vol. 2",
    "Spider-Man: Homecoming",
    "Thor: Ragnarok ★",
    "Black Panther",
    "Avengers: Infinity War ★",
    "Ant-Man and the Wasp ★",
    "Captain Marvel",
    "Avengers: Endgame ★",
    "Spider-Man: Far From Home ★",
    # Phase 4 (2021-2022)
    "WandaVision ★",
    "Falcon & The Winter Soldier ★",
    "Loki — Season 1 & 2 ★",
    "Black Widow",
    "Shang-Chi and the Legend of the Ten Rings",
    "Hawkeye",
    "Spider-Man: No Way Home ★",
    "Moon Knight",
    "Doctor Strange in the Multiverse of Madness ★",
    "Thor: Love and Thunder",
    "Black Panther: Wakanda Forever ★",
    # Phase 5 (2023-2024)
    "Ant-Man and the Wasp: Quantumania",
    "The Marvels",
    "Deadpool & Wolverine ★",
    # Phase 6 (2025-2027)
    "Captain America: Brave New World ★",
    "Thunderbolts* ★",
    "The Fantastic Four: First Steps ★",
    "Wonder Man",
    "Daredevil: Born Again — Season 2",
    "VisionQuest",
    "Spider-Man: Brand New Day ★",
    "Avengers: Doomsday ★",
]

def renumber_json(filename):
    """Renumber items in JSON file according to chronological order."""
    print(f"\nProcessing {filename}...")
    
    with open(filename, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Separate bonus items
    bonus_items = [item for item in data['items'] if item.get('bonus', False)]
    mcu_items = [item for item in data['items'] if not item.get('bonus', False)]
    
    # Create mapping of old keys to items
    title_to_item = {}
    for item in mcu_items:
        # Normalize title for matching (remove ★)
        normalized_title = item['title'].replace(' ★', '').strip()
        title_to_item[normalized_title] = item
    
    # Reorder and renumber
    new_items = []
    for new_key, title in enumerate(CHRONOLOGICAL_ORDER, start=1):
        normalized_title = title.replace(' ★', '').strip()
        
        if normalized_title not in title_to_item:
            print(f"  WARNING: '{title}' not found in data!")
            continue
        
        item = title_to_item[normalized_title].copy()
        old_key = item['key']
        item['key'] = str(new_key)
        
        # Update localImage path
        if 'localImage' in item:
            item['localImage'] = f"./assets/posters/{new_key}.jpg"
        
        new_items.append(item)
        print(f"  {old_key:>3} → {new_key:>2}. {item['title']}")
    
    # Add bonus items at the end
    new_items.extend(bonus_items)
    
    # Update data
    data['items'] = new_items
    data['count'] = len(new_items) - len(bonus_items)
    
    # Save
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"  ✓ Renumbered {len(new_items)} items ({data['count']} MCU + {len(bonus_items)} bonus)")
    
    return new_items

def rename_poster_files(items):
    """Rename poster files to match new numbering."""
    print("\nRenaming poster files...")
    poster_dir = Path("../assets/posters")
    
    if not poster_dir.exists():
        print("  Poster directory not found, skipping...")
        return
    
    # Create mapping of old to new filenames
    renames = []
    for item in items:
        if item.get('bonus', False):
            continue
        
        old_local = item.get('localImage', '')
        if not old_local:
            continue
        
        # Extract old number from original data
        # We'll need to track this during renumbering
        new_key = item['key']
        new_filename = f"{new_key}.jpg"
        
        renames.append((new_key, new_filename))
    
    print(f"  Note: Poster files will need manual renaming or re-caching")
    print(f"  Run: node cache-marvel-images.mjs")

# Process all JSON files
files = ['watchlist.en.json', 'watchlist.nl.json', 'watchlist.json']

for filename in files:
    items = renumber_json(filename)

print("\n" + "="*60)
print("✓ Renumbering complete!")
print("="*60)
print("\nNext steps:")
print("1. Run: node cache-marvel-images.mjs")
print("   (This will download posters with correct numbering)")
print("2. Clear browser localStorage to reset progress")
print("3. Test the application")

# Made with Bob
