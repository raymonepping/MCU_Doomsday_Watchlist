#!/usr/bin/env python3
"""
Add saga tags to all items in watchlist JSON files.

Saga mapping:
- Items 1-23: Infinity Saga (Phases 1-3)
- Items 24-30: Multiverse Saga (Phases 4-6)
- All main items (1-30): Doomsday
- Bonus items (B1-B3): X-Men saga
"""

import json
from pathlib import Path

def add_saga_tags():
    """Add saga field to all items in both EN and NL JSON files."""
    
    # Define saga mappings
    infinity_saga_keys = list(range(1, 24))  # Keys 1-23
    multiverse_saga_keys = list(range(24, 31))  # Keys 24-30
    doomsday_keys = list(range(1, 31))  # Keys 1-30
    xmen_saga_keys = ["B1", "B2", "B3"]  # Bonus items
    
    # Process both language files
    for lang in ["en", "nl"]:
        file_path = Path(__file__).parent / f"watchlist.{lang}.json"
        
        print(f"\nProcessing {file_path.name}...")
        
        # Read the JSON file
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Add saga tags to each item
        modified_count = 0
        for item in data['items']:
            key = item['key']
            sagas = []
            
            # Determine which sagas this item belongs to
            try:
                key_num = int(key)
                
                # Check Infinity Saga
                if key_num in infinity_saga_keys:
                    sagas.append("infinity-saga")
                
                # Check Multiverse Saga
                if key_num in multiverse_saga_keys:
                    sagas.append("multiverse-saga")
                
                # Check Doomsday
                if key_num in doomsday_keys:
                    sagas.append("doomsday")
                    
            except ValueError:
                # Handle bonus keys (B1, B2, B3)
                if key in xmen_saga_keys:
                    sagas.append("x-men")
            
            # Add saga field to item
            if sagas:
                item['saga'] = sagas
                modified_count += 1
                print(f"  {key}: {item['title']} -> {sagas}")
        
        # Write back to file
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        print(f"✓ Modified {modified_count} items in {file_path.name}")

if __name__ == "__main__":
    add_saga_tags()
    print("\n✓ Saga tags added successfully to all files!")

# Made with Bob
