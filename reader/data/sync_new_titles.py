#!/usr/bin/env python3
"""
Sync new titles and phase data from watchlist.en.json to watchlist.nl.json and watchlist.json
"""
import json

def load_json(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_json(filename, data):
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

# Load all files
en_data = load_json('watchlist.en.json')
nl_data = load_json('watchlist.nl.json')
main_data = load_json('watchlist.json')

# Create key-to-item maps for existing items
nl_map = {item['key']: item for item in nl_data['items']}
main_map = {item['key']: item for item in main_data['items']}

# Process each English item
for en_item in en_data['items']:
    key = en_item['key']
    
    # Update Dutch file
    if key in nl_map:
        # Update existing item with phase data
        nl_map[key]['phase'] = en_item.get('phase')
    else:
        # Add new item (copy from English, needs translation)
        new_nl_item = en_item.copy()
        new_nl_item['title'] = en_item['title']  # Keep English title for now
        new_nl_item['what'] = f"[NL TRANSLATION NEEDED] {en_item['what']}"
        new_nl_item['why'] = f"[NL TRANSLATION NEEDED] {en_item['why']}"
        new_nl_item['when'] = f"[NL TRANSLATION NEEDED] {en_item['when']}"
        new_nl_item['who'] = f"[NL TRANSLATION NEEDED] {en_item['who']}"
        nl_data['items'].append(new_nl_item)
        print(f"Added new item to NL: {key} - {en_item['title']}")
    
    # Update main file
    if key in main_map:
        # Update existing item with phase data
        main_map[key]['phase'] = en_item.get('phase')
    else:
        # Add new item (copy from English)
        main_data['items'].append(en_item.copy())
        print(f"Added new item to main: {key} - {en_item['title']}")

# Update counts
nl_data['count'] = len([i for i in nl_data['items'] if not i.get('bonus', False)])
main_data['count'] = len([i for i in main_data['items'] if not i.get('bonus', False)])

# Save updated files
save_json('watchlist.nl.json', nl_data)
save_json('watchlist.json', main_data)

print(f"\n✓ Sync complete!")
print(f"  EN: {en_data['count']} titles")
print(f"  NL: {nl_data['count']} titles")
print(f"  Main: {main_data['count']} titles")

# Made with Bob
