#!/usr/bin/env python3
"""
Add chronologicalOrder field to watchlist JSON files
"""

import json

# Chronological order mapping (key -> chronological position)
CHRONOLOGICAL_ORDER = {
    "5": 1,   # Captain America: The First Avenger (1940s)
    "21": 2,  # Captain Marvel (1995)
    "1": 3,   # Iron Man (2008)
    "2": 4,   # The Incredible Hulk (2008)
    "3": 5,   # Iron Man 2 (2010)
    "4": 6,   # Thor (2011)
    "6": 7,   # The Avengers (2012)
    "7": 8,   # Iron Man 3 (2013)
    "8": 9,   # Thor: The Dark World (2013)
    "9": 10,  # Captain America: The Winter Soldier (2014)
    "10": 11, # Guardians of the Galaxy (2014)
    "11": 12, # Avengers: Age of Ultron (2015)
    "12": 13, # Ant-Man (2015)
    "13": 14, # Captain America: Civil War (2016)
    "18": 15, # Black Panther (2016)
    "14": 16, # Doctor Strange (2016-2017)
    "16": 17, # Spider-Man: Homecoming (2016)
    "15": 18, # Guardians of the Galaxy Vol. 2 (2017)
    "17": 19, # Thor: Ragnarok (2017)
    "20": 20, # Ant-Man and the Wasp (2018)
    "19": 21, # Avengers: Infinity War (2018)
    "22": 22, # Avengers: Endgame (2018-2023)
    "24": 23, # WandaVision (2023)
    "25": 24, # Falcon & The Winter Soldier (2024)
    "23": 25, # Spider-Man: Far From Home (2024)
    "28": 26, # Shang-Chi (2024)
    "29": 27, # Hawkeye (2024)
    "31": 28, # Moon Knight (2025)
    "30": 29, # Spider-Man: No Way Home (2024-2025)
    "32": 30, # Doctor Strange MoM (2025)
    "33": 31, # Thor: Love and Thunder (2025)
    "27": 32, # Black Widow (watch here despite flashback)
    "26": 33, # Loki S1&2 (outside time, watch here)
    "35": 34, # Ant-Man Quantumania (2025)
    "34": 35, # Black Panther: Wakanda Forever (2025)
    "36": 36, # The Marvels (2026)
    "37": 37, # Deadpool & Wolverine (2026)
    "38": 38, # Captain America: Brave New World (2026)
    "39": 39, # Thunderbolts (2026)
    "40": 40, # Fantastic Four (alt-Earth, watch here)
    "41": 41, # Wonder Man (2026)
    "43": 42, # VisionQuest (2026)
    "42": 43, # Daredevil S2 (2027)
    "44": 44, # Spider-Man: Brand New Day (2026)
    "45": 45, # Avengers: Doomsday (2026)
    # Bonus titles - keep same order as release
    "B1": 46, # X-Men (2000)
    "B2": 47, # X2 (2003)
    "B3": 48, # Days of Future Past (2014)
}

def add_chronological_order(filename):
    """Add chronologicalOrder field to JSON file"""
    print(f"Processing {filename}...")
    
    with open(filename, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Add chronologicalOrder to each item
    for item in data['items']:
        key = item['key']
        if key in CHRONOLOGICAL_ORDER:
            item['chronologicalOrder'] = CHRONOLOGICAL_ORDER[key]
        else:
            print(f"Warning: No chronological order for key {key}")
    
    # Write back to file with pretty formatting
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Updated {filename}")

if __name__ == '__main__':
    add_chronological_order('watchlist.en.json')
    add_chronological_order('watchlist.nl.json')
    print("\n🎉 All files updated with chronological order!")

# Made with Bob
