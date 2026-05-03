#!/usr/bin/env python3
"""
Add official US theatrical release dates to MCU watchlist items.
Release dates sourced from IMDB.com and official Marvel sources.
Format: YYYY-MM-DD (ISO 8601)
"""

import json

# Official US theatrical release dates from IMDB
# For series: First episode air date
# For unreleased titles: Announced release dates (subject to change)
RELEASE_DATES = {
    # Phase 1
    "1": "2008-05-02",    # Iron Man
    "2": "2008-06-13",    # The Incredible Hulk
    "3": "2010-05-07",    # Iron Man 2
    "4": "2011-05-06",    # Thor
    "5": "2011-07-22",    # Captain America: The First Avenger
    "6": "2012-05-04",    # The Avengers
    
    # Phase 2
    "7": "2013-05-03",    # Iron Man 3
    "8": "2013-11-08",    # Thor: The Dark World
    "9": "2014-04-04",    # Captain America: The Winter Soldier
    "10": "2014-08-01",   # Guardians of the Galaxy
    "11": "2015-05-01",   # Avengers: Age of Ultron
    "12": "2015-07-17",   # Ant-Man
    
    # Phase 3
    "13": "2016-05-06",   # Captain America: Civil War
    "14": "2016-11-04",   # Doctor Strange
    "15": "2017-05-05",   # Guardians of the Galaxy Vol. 2
    "16": "2017-07-07",   # Spider-Man: Homecoming
    "17": "2017-11-03",   # Thor: Ragnarok
    "18": "2018-02-16",   # Black Panther
    "19": "2018-04-27",   # Avengers: Infinity War
    "20": "2018-07-06",   # Ant-Man and the Wasp
    "21": "2019-03-08",   # Captain Marvel
    "22": "2019-04-26",   # Avengers: Endgame
    "23": "2019-07-02",   # Spider-Man: Far From Home
    
    # Phase 4
    "24": "2021-01-15",   # WandaVision (Disney+)
    "25": "2021-03-19",   # Falcon & The Winter Soldier (Disney+)
    "26": "2021-06-09",   # Loki Season 1 (Disney+)
    "27": "2021-07-09",   # Black Widow
    "28": "2021-09-03",   # Shang-Chi and the Legend of the Ten Rings
    "29": "2021-11-24",   # Hawkeye (Disney+)
    "30": "2021-12-17",   # Spider-Man: No Way Home
    "31": "2022-03-30",   # Moon Knight (Disney+)
    "32": "2022-05-06",   # Doctor Strange in the Multiverse of Madness
    "33": "2022-07-08",   # Thor: Love and Thunder
    "34": "2022-11-11",   # Black Panther: Wakanda Forever
    
    # Phase 5
    "35": "2023-02-17",   # Ant-Man and the Wasp: Quantumania
    "36": "2023-11-10",   # The Marvels
    "37": "2024-07-26",   # Deadpool & Wolverine
    "47": "2024-01-10",   # Echo (Disney+)
    "48": "2024-09-18",   # Agatha All Along (Disney+)
    
    # Phase 6 (Announced/Scheduled)
    "38": "2025-02-14",   # Captain America: Brave New World
    "39": "2025-05-02",   # Thunderbolts*
    "40": "2025-07-25",   # The Fantastic Four: First Steps
    "41": "2025-12-01",   # Wonder Man (Disney+) - Estimated
    "42": "2025-03-04",   # Daredevil: Born Again Season 1 (Disney+)
    "43": "2026-01-01",   # VisionQuest (Disney+) - Estimated
    "44": "2026-07-24",   # Spider-Man: Brand New Day - Estimated
    "45": "2026-05-01",   # Avengers: Doomsday
    "49": "2026-03-01",   # Daredevil: Born Again Season 2 (Disney+) - Estimated
    
    # Legacy Content
    "46": "2015-01-06",   # Agent Carter Season 1 (ABC)
    
    # Bonus: Fox X-Men
    "B1": "2000-07-14",   # X-Men (2000)
    "B2": "2003-05-02",   # X2: X-Men United
    "B3": "2014-05-23",   # X-Men: Days of Future Past
    
    # Bonus: Sony Spider-Man
    "SM1": "2002-05-03",  # Spider-Man (Raimi)
    "SM2": "2004-06-30",  # Spider-Man 2
    "SM3": "2007-05-04",  # Spider-Man 3
    "TASM1": "2012-07-03", # The Amazing Spider-Man
}

def add_release_dates(filename):
    """Add releaseDate field to all items in JSON file."""
    with open(filename, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    updated_count = 0
    missing_count = 0
    
    for item in data['items']:
        key = item['key']
        if key in RELEASE_DATES:
            item['releaseDate'] = RELEASE_DATES[key]
            updated_count += 1
            print(f"✓ {key:>5} | {RELEASE_DATES[key]} | {item['title']}")
        else:
            missing_count += 1
            print(f"✗ {key:>5} | NO DATE    | {item['title']}")
    
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    return updated_count, missing_count

# Update both files
print("ADDING RELEASE DATES TO WATCHLIST FILES")
print("=" * 80)

for filename in ['watchlist.en.json', 'watchlist.nl.json']:
    print(f"\n{filename}:")
    print("-" * 80)
    updated, missing = add_release_dates(filename)
    print(f"\n✓ Updated: {updated} items")
    if missing > 0:
        print(f"⚠ Missing dates: {missing} items")

print("\n" + "=" * 80)
print("✅ Release dates added successfully!")
print("\nNote: Future release dates are estimates and subject to change.")

# Made with Bob