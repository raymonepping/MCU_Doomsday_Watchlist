#!/usr/bin/env python3
"""
Add Spider-Man saga films and update saga tags.

New films to add:
- SM1: Spider-Man (2002)
- SM2: Spider-Man 2 (2004)
- SM3: Spider-Man 3 (2007)
- TASM1: The Amazing Spider-Man (2012)

Existing films to tag:
- 16: Spider-Man: Homecoming
- 23: Spider-Man: Far From Home
- 30: Spider-Man: No Way Home
- 44: Spider-Man: Brand New Day
"""

import json
from pathlib import Path
from datetime import datetime

def add_spiderman_saga():
    """Add Spider-Man films and update saga tags."""
    
    # New Spider-Man films to add
    new_films = {
        "SM1": {
            "key": "SM1",
            "title": "Spider-Man",
            "kind": "Film",
            "runtime": "2h 1m",
            "bonus": False,
            "phase": None,
            "saga": ["spider-man"],
            "what": "Average teenager Peter Parker is transformed into an extraordinary superhero after he is accidentally bitten by a radioactive spider. When his beloved uncle is savagely murdered during a robbery, young Peter vows to use his powers to avenge his death.",
            "why": "The original Spider-Man film that launched the modern superhero movie era. Establishes Peter Parker's origin story and core values.",
            "when": "2002 - Before the MCU began",
            "who": "Tobey Maguire as Peter Parker/Spider-Man, Kirsten Dunst as Mary Jane Watson, Willem Dafoe as Green Goblin",
            "officialUrl": "https://www.marvel.com/movies/spider-man",
            "chronologicalOrder": None
        },
        "SM2": {
            "key": "SM2",
            "title": "Spider-Man 2",
            "kind": "Film",
            "runtime": "2h 7m",
            "bonus": False,
            "phase": None,
            "saga": ["spider-man"],
            "what": "Peter Parker is juggling the delicate balance of his dual life as college student and a superhuman crime fighter. Peter's life becomes even more complicated when he confronts a new nemesis, the brilliant Otto Octavius who has been reincarnated as the maniacal and multi-tentacled Doc Ock.",
            "why": "Widely considered one of the best superhero films ever made. Explores the personal cost of being a hero.",
            "when": "2004 - The Raimi trilogy continues",
            "who": "Tobey Maguire as Peter Parker/Spider-Man, Kirsten Dunst as Mary Jane Watson, Alfred Molina as Doc Ock",
            "officialUrl": "https://www.marvel.com/movies/spider-man-2",
            "chronologicalOrder": None
        },
        "SM3": {
            "key": "SM3",
            "title": "Spider-Man 3",
            "kind": "Film",
            "runtime": "2h 19m",
            "bonus": False,
            "phase": None,
            "saga": ["spider-man"],
            "what": "Peter Parker finally has the girl of his dreams, Mary Jane Watson, and New York City is in the throes of Spider-mania! But when a strange alien symbiote turns Spider-Man's suit black, his darkest demons come to light.",
            "why": "Introduces the symbiote and Venom. Concludes the Raimi trilogy.",
            "when": "2007 - The Raimi trilogy concludes",
            "who": "Tobey Maguire as Peter Parker/Spider-Man, Kirsten Dunst as Mary Jane Watson, Thomas Haden Church as Sandman, Topher Grace as Venom, James Franco as New Goblin",
            "officialUrl": "https://www.marvel.com/movies/spider-man-3",
            "chronologicalOrder": None
        },
        "TASM1": {
            "key": "TASM1",
            "title": "The Amazing Spider-Man",
            "kind": "Film",
            "runtime": "2h 16m",
            "bonus": False,
            "phase": None,
            "saga": ["spider-man"],
            "what": "A teenage Peter Parker grapples with both high school and amazing super-human crises as his alter-ego Spider-Man.",
            "why": "Reboot of the Spider-Man franchise with a new take on the origin story. Introduces Andrew Garfield's version of Peter Parker.",
            "when": "2012 - The Amazing Spider-Man era begins",
            "who": "Andrew Garfield as Peter Parker/Spider-Man, Emma Stone as Gwen Stacy",
            "officialUrl": "https://www.marvel.com/movies/the-amazing-spider-man",
            "chronologicalOrder": None
        }
    }
    
    # Keys of existing Spider-Man films to tag
    existing_spiderman_keys = ["16", "23", "30", "44"]
    
    # Process both language files
    for lang in ["en", "nl"]:
        file_path = Path(__file__).parent / f"watchlist.{lang}.json"
        
        print(f"\nProcessing {file_path.name}...")
        
        # Read the JSON file
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Add spider-man saga to existing Spider-Man films
        modified_count = 0
        for item in data['items']:
            if item['key'] in existing_spiderman_keys:
                if 'saga' in item:
                    if 'spider-man' not in item['saga']:
                        item['saga'].append('spider-man')
                        modified_count += 1
                        print(f"  Updated {item['key']}: {item['title']} -> added spider-man saga")
                else:
                    item['saga'] = ['spider-man']
                    modified_count += 1
                    print(f"  Updated {item['key']}: {item['title']} -> added spider-man saga")
        
        # Add new Spider-Man films
        for key, film in new_films.items():
            # Check if film already exists
            if not any(item['key'] == key for item in data['items']):
                data['items'].append(film)
                print(f"  Added {key}: {film['title']}")
                modified_count += 1
        
        # Update counts
        data['count'] = len([item for item in data['items'] if not item.get('bonus', False)])
        data['bonusCount'] = len([item for item in data['items'] if item.get('bonus', False)])
        data['generatedAt'] = datetime.utcnow().isoformat() + 'Z'
        
        # Write back to file
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        print(f"✓ Modified/added {modified_count} items in {file_path.name}")
        print(f"  Total count: {data['count']} main + {data['bonusCount']} bonus = {len(data['items'])} total")

if __name__ == "__main__":
    add_spiderman_saga()
    print("\n✓ Spider-Man saga added successfully to all files!")

# Made with Bob
