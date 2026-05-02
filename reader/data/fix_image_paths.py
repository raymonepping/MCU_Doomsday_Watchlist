#!/usr/bin/env python3
"""Fix localImage paths to use zero-padded filenames (01.jpg instead of 1.jpg)."""
import json

def fix_paths(filename):
    """Update localImage paths to use zero-padded format."""
    print(f"\nFixing {filename}...")
    
    with open(filename, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    fixed_count = 0
    for item in data['items']:
        if 'localImage' in item and not item.get('bonus', False):
            old_path = item['localImage']
            # Extract number from path like "./assets/posters/1.jpg"
            if '/posters/' in old_path:
                parts = old_path.split('/posters/')
                if len(parts) == 2:
                    filename_part = parts[1]  # e.g., "1.jpg"
                    # Extract number and extension
                    if filename_part[0].isdigit():
                        num_str = ''
                        for char in filename_part:
                            if char.isdigit():
                                num_str += char
                            else:
                                break
                        
                        if num_str:
                            num = int(num_str)
                            ext = filename_part[len(num_str):]  # e.g., ".jpg"
                            # Create zero-padded version
                            new_filename = f"{num:02d}{ext}"
                            new_path = f"./assets/posters/{new_filename}"
                            
                            if old_path != new_path:
                                item['localImage'] = new_path
                                fixed_count += 1
                                print(f"  {item['key']:>2}. {old_path} → {new_path}")
    
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"  ✓ Fixed {fixed_count} paths")

# Fix all JSON files
files = ['watchlist.en.json', 'watchlist.nl.json', 'watchlist.json']

for filename in files:
    fix_paths(filename)

print("\n✓ All image paths fixed to use zero-padded format (01.jpg, 02.jpg, etc.)")

# Made with Bob
