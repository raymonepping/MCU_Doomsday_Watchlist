#!/usr/bin/env python3
"""
Add The Amazing Spider-Man 2 to the dataset and fix Earth designation for TASM films.
"""

import json
from pathlib import Path

# File paths
WATCHLIST_EN = Path("watchlist.en.json")
WATCHLIST_NL = Path("watchlist.nl.json")

# The Amazing Spider-Man 2 data
TASM2_EN = {
    "key": "TASM2",
    "title": "The Amazing Spider-Man 2",
    "kind": "Film",
    "runtime": "2h 22m",
    "bonus": False,
    "phase": None,
    "saga": ["spider-man"],
    "what": "Peter Parker faces new threats as Electro and Harry Osborn's Green Goblin while trying to uncover the truth about his parents and maintain his relationship with Gwen Stacy.",
    "why": "Completes Andrew Garfield's Spider-Man arc with Gwen Stacy's death, which becomes his defining trauma and motivation in No Way Home. Essential context for understanding his redemption arc.",
    "when": "2014 - Amazing Spider-Man universe sequel. Watch before No Way Home to understand Andrew Garfield's grief and need for redemption.",
    "who": "Andrew Garfield as Peter Parker/Spider-Man, Emma Stone as Gwen Stacy, Jamie Foxx as Max Dillon/Electro, Dane DeHaan as Harry Osborn/Green Goblin, Sally Field as Aunt May",
    "officialUrl": "https://marvel.fandom.com/wiki/The_Amazing_Spider-Man_2_(film)",
    "chronologicalOrder": 15,
    "localImage": "./assets/posters/TASM2.jpg",
    "imageUrl": "https://static.wikia.nocookie.net/marveldatabase/images/5/53/The_Amazing_Spider-Man_2_%28film%29_poster_005.jpg",
    "releaseDate": "2014-05-02",
    "earth": "Earth-120703",
    "status": "Optional"
}

TASM2_NL = {
    "key": "TASM2",
    "title": "The Amazing Spider-Man 2",
    "kind": "Film",
    "runtime": "2h 22m",
    "bonus": False,
    "phase": None,
    "saga": ["spider-man"],
    "what": "Peter Parker krijgt te maken met nieuwe bedreigingen zoals Electro en Harry Osborn's Green Goblin, terwijl hij de waarheid over zijn ouders probeert te achterhalen en zijn relatie met Gwen Stacy in stand probeert te houden.",
    "why": "Voltooit Andrew Garfield's Spider-Man verhaal met Gwen Stacy's dood, wat zijn bepalende trauma en motivatie wordt in No Way Home. Essentiële context voor het begrijpen van zijn verlossingsarc.",
    "when": "2014 - Amazing Spider-Man universum vervolg. Kijk voor No Way Home om Andrew Garfield's verdriet en behoefte aan verlossing te begrijpen.",
    "who": "Andrew Garfield als Peter Parker/Spider-Man, Emma Stone als Gwen Stacy, Jamie Foxx als Max Dillon/Electro, Dane DeHaan als Harry Osborn/Green Goblin, Sally Field als Tante May",
    "officialUrl": "https://marvel.fandom.com/wiki/The_Amazing_Spider-Man_2_(film)",
    "chronologicalOrder": 15,
    "localImage": "./assets/posters/TASM2.jpg",
    "imageUrl": "https://static.wikia.nocookie.net/marveldatabase/images/5/53/The_Amazing_Spider-Man_2_%28film%29_poster_005.jpg",
    "releaseDate": "2014-05-02",
    "earth": "Earth-120703",
    "status": "Optional"
}

def add_tasm2_and_fix_earth(file_path: Path, tasm2_data: dict, is_english: bool = True) -> None:
    """Add TASM2 and fix Earth designation for TASM films."""
    print(f"\n📝 Processing {file_path.name}...")
    
    # Load data
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Fix TASM1 Earth designation
    tasm1_fixed = False
    for item in data['items']:
        if item['key'] == 'TASM1':
            if item.get('earth') != 'Earth-120703':
                item['earth'] = 'Earth-120703'
                tasm1_fixed = True
                print(f"  ✅ Fixed TASM1 earth: Earth-96283 → Earth-120703")
    
    # Check if TASM2 already exists
    tasm2_exists = any(item['key'] == 'TASM2' for item in data['items'])
    
    if tasm2_exists:
        print(f"  ⚠️  TASM2 already exists, skipping addition")
    else:
        # Add TASM2 after TASM1
        tasm1_index = next(i for i, item in enumerate(data['items']) if item['key'] == 'TASM1')
        data['items'].insert(tasm1_index + 1, tasm2_data)
        data['count'] = len(data['items'])
        print(f"  ✅ Added TASM2 after TASM1 (position {tasm1_index + 2})")
    
    # Update metadata
    data['generatedAt'] = "2026-05-04T14:30:00.000000Z"
    
    # Write updated data
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"  ✅ Saved {file_path.name}")
    print(f"  📊 Total items: {data['count']}")

def main():
    print("=" * 80)
    print("🕷️  Adding The Amazing Spider-Man 2")
    print("=" * 80)
    
    # Process English dataset
    add_tasm2_and_fix_earth(WATCHLIST_EN, TASM2_EN, is_english=True)
    
    # Process Dutch dataset
    add_tasm2_and_fix_earth(WATCHLIST_NL, TASM2_NL, is_english=False)
    
    print("\n" + "=" * 80)
    print("✅ TASM2 addition complete!")
    print("=" * 80)
    print("\n📋 Summary:")
    print("   - Added The Amazing Spider-Man 2 to both datasets")
    print("   - Fixed Earth designation for TASM films: Earth-120703")
    print("   - Chronological order: 15 (between TASM1 and Thor: The Dark World)")
    print("   - Release date: 2014-05-02")
    print("\n🎯 Next steps:")
    print("   1. Download poster image to ./assets/posters/TASM2.jpg")
    print("   2. Test the app")
    print("   3. Commit and release")

if __name__ == "__main__":
    main()

# Made with Bob
