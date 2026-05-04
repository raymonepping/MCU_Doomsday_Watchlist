#!/usr/bin/env python3
"""
Enhance MCU dataset with earth, status fields and fix mismatches.
Based on analysis from marvel_multiverse_chronological_order.md and marvel_multiverse_release_order.md
"""

import json
from pathlib import Path
from typing import Dict, List

# File paths
WATCHLIST_EN = Path("watchlist.en.json")
WATCHLIST_NL = Path("watchlist.nl.json")
BACKUP_EN = Path("watchlist.en.json.backup")
BACKUP_NL = Path("watchlist.nl.json.backup")

# Earth/Universe mappings based on title
EARTH_MAPPINGS = {
    # Raimi Spider-Man trilogy
    "Spider-Man": "Earth-96283",
    "Spider-Man 2": "Earth-96283",
    "Spider-Man 3": "Earth-96283",
    
    # Amazing Spider-Man
    "The Amazing Spider-Man": "Earth-120703",
    
    # Netflix Defenders Saga
    "Daredevil": "Netflix Defenders Saga",
    "Jessica Jones": "Netflix Defenders Saga",
    "Luke Cage": "Netflix Defenders Saga",
    "Iron Fist": "Netflix Defenders Saga",
    "The Defenders": "Netflix Defenders Saga",
    "The Punisher": "Netflix Defenders Saga",
    
    # TVA/Multiverse
    "Loki": "TVA / Multiverse",
    
    # Fantastic Four
    "The Fantastic Four: First Steps": "Earth-828",
    
    # Deadpool & Wolverine
    "Deadpool & Wolverine": "Multiverse",
    
    # Default: Main MCU
    "_default": "Earth-199999 / Earth-616"
}

# Status mappings based on analysis report
STATUS_ESSENTIAL = [
    "Iron Man",
    "Captain America: The First Avenger",
    "The Avengers",
    "Avengers: Age of Ultron",
    "Captain America: Civil War",
    "Doctor Strange",
    "Spider-Man: No Way Home",
    "The Fantastic Four: First Steps"
]

# Chronological order corrections from analysis report
CHRONOLOGICAL_ORDER_FIXES = {
    "Spider-Man": 1,
    "Spider-Man 2": 2,
    "Spider-Man 3": 3,
    "Captain America: The First Avenger": 5,
    "The Fantastic Four: First Steps": 6,
    "Captain Marvel": 7,
    "The Amazing Spider-Man": 8,
    "Iron Man": 9,
    "Iron Man 2": 10,
    "The Incredible Hulk": 11,
    "Thor": 12,
    "The Avengers": 13,
    "Iron Man 3": 14,
    "Thor: The Dark World": 16,
    "Captain America: The Winter Soldier": 17,
    "Guardians of the Galaxy": 18,
    "Guardians of the Galaxy Vol. 2": 19,
    "Avengers: Age of Ultron": 22,
    "Ant-Man": 23,
    "Jessica Jones: Season 1": 24,
    "Captain America: Civil War": 26,
    "Black Widow": 27,
    "Luke Cage: Season 1": 28,
    "Spider-Man: Homecoming": 29,
    "Iron Fist: Season 1": 30,
    "Doctor Strange": 31,
    "Black Panther": 32,
    "The Defenders": 33,
    "The Punisher: Season 1": 34,
    "Loki: Season 1": 47,
    "Shang-Chi and the Legend of the Ten Rings": 50,
    "Doctor Strange in the Multiverse of Madness": 52,
    "Hawkeye": 53,
    "Moon Knight": 54,
    "Echo": 56,
    "Thor: Love and Thunder": 59,
    "Ant-Man and the Wasp: Quantumania": 63,
    "The Marvels": 66,
    "Deadpool & Wolverine": 69,
    "Agatha All Along": 70,
    "Daredevil: Born Again: Season 1": 72,
    "Captain America: Brave New World": 73,
    "Thunderbolts*": 74,
    "Daredevil: Born Again: Season 2": 77,
    "Wonder Man: Season 1": 78,
    "Spider-Man: Brand New Day": 79,
    "Avengers: Doomsday": 80
}

# Release date corrections from analysis report
RELEASE_DATE_FIXES = {
    "Echo": "2024-01-09",
    "Wonder Man: Season 1": "2026-01-27",
    "Daredevil: Born Again: Season 2": "2026-03-24",
    "Spider-Man: Brand New Day": "2026-07-31",
    "Avengers: Doomsday": "2026-12-18"
}

def get_earth_designation(title: str) -> str:
    """Determine Earth designation for a title."""
    # Check exact matches first
    for key, earth in EARTH_MAPPINGS.items():
        if key in title:
            return earth
    
    # Default to main MCU
    return EARTH_MAPPINGS["_default"]

def get_status(title: str) -> str:
    """Determine status (ESSENTIAL or Optional) for a title."""
    if title in STATUS_ESSENTIAL:
        return "ESSENTIAL"
    return "Optional"

def normalize_title(title: str) -> str:
    """Normalize title for matching."""
    return title.strip()

def enhance_dataset(file_path: Path, backup_path: Path) -> None:
    """Enhance a dataset file with new fields and fixes."""
    print(f"\n📝 Processing {file_path.name}...")
    
    # Create backup
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    with open(backup_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"✅ Backup created: {backup_path.name}")
    
    # Track changes
    earth_added = 0
    status_added = 0
    chrono_fixed = 0
    date_fixed = 0
    
    # Process each item
    for item in data['items']:
        title = normalize_title(item['title'])
        
        # Add earth field
        if 'earth' not in item:
            item['earth'] = get_earth_designation(title)
            earth_added += 1
        
        # Add status field
        if 'status' not in item:
            item['status'] = get_status(title)
            status_added += 1
        
        # Fix chronological order
        if title in CHRONOLOGICAL_ORDER_FIXES:
            old_order = item.get('chronologicalOrder')
            new_order = CHRONOLOGICAL_ORDER_FIXES[title]
            if old_order != new_order:
                item['chronologicalOrder'] = new_order
                chrono_fixed += 1
                print(f"  📊 {title}: chronologicalOrder {old_order} → {new_order}")
        
        # Fix release date
        if title in RELEASE_DATE_FIXES:
            old_date = item.get('releaseDate')
            new_date = RELEASE_DATE_FIXES[title]
            if old_date != new_date:
                item['releaseDate'] = new_date
                date_fixed += 1
                print(f"  📅 {title}: releaseDate {old_date} → {new_date}")
    
    # Update metadata
    data['generatedAt'] = "2026-05-04T14:20:00.000000Z"
    
    # Write enhanced data
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Enhanced {file_path.name}:")
    print(f"   - Earth fields added: {earth_added}")
    print(f"   - Status fields added: {status_added}")
    print(f"   - Chronological order fixed: {chrono_fixed}")
    print(f"   - Release dates fixed: {date_fixed}")

def verify_enhancements(file_path: Path) -> None:
    """Verify all items have required fields."""
    print(f"\n🔍 Verifying {file_path.name}...")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    missing_earth = []
    missing_status = []
    
    for item in data['items']:
        if 'earth' not in item:
            missing_earth.append(item['title'])
        if 'status' not in item:
            missing_status.append(item['title'])
    
    if missing_earth:
        print(f"❌ Missing earth field: {len(missing_earth)} items")
        for title in missing_earth[:5]:
            print(f"   - {title}")
    else:
        print("✅ All items have earth field")
    
    if missing_status:
        print(f"❌ Missing status field: {len(missing_status)} items")
        for title in missing_status[:5]:
            print(f"   - {title}")
    else:
        print("✅ All items have status field")
    
    # Show Earth distribution
    earth_counts = {}
    status_counts = {}
    
    for item in data['items']:
        earth = item.get('earth', 'Unknown')
        status = item.get('status', 'Unknown')
        earth_counts[earth] = earth_counts.get(earth, 0) + 1
        status_counts[status] = status_counts.get(status, 0) + 1
    
    print("\n🌍 Earth Distribution:")
    for earth, count in sorted(earth_counts.items(), key=lambda x: -x[1]):
        print(f"   - {earth}: {count} items")
    
    print("\n⭐ Status Distribution:")
    for status, count in sorted(status_counts.items(), key=lambda x: -x[1]):
        print(f"   - {status}: {count} items")

def main():
    print("=" * 80)
    print("🚀 MCU Dataset Enhancement Script")
    print("=" * 80)
    print("\nThis script will:")
    print("1. Add 'earth' field to all items")
    print("2. Add 'status' field to all items")
    print("3. Fix chronological order mismatches")
    print("4. Fix release date mismatches")
    print("5. Create backups before making changes")
    
    # Enhance English dataset
    enhance_dataset(WATCHLIST_EN, BACKUP_EN)
    verify_enhancements(WATCHLIST_EN)
    
    # Enhance Dutch dataset
    enhance_dataset(WATCHLIST_NL, BACKUP_NL)
    verify_enhancements(WATCHLIST_NL)
    
    print("\n" + "=" * 80)
    print("✅ Dataset enhancement complete!")
    print("=" * 80)
    print("\n📋 Summary:")
    print("   - Both EN and NL datasets enhanced")
    print("   - Backups created (.backup files)")
    print("   - All items now have earth and status fields")
    print("   - Chronological order and release dates corrected")
    print("\n🎯 Next steps:")
    print("   1. Review the changes in the JSON files")
    print("   2. Test the app to ensure everything works")
    print("   3. Commit and release the changes")
    print("   4. Gradually add missing titles from the analysis report")

if __name__ == "__main__":
    main()

# Made with Bob
