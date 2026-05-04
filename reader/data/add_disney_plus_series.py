#!/usr/bin/env python3
"""
Add 5 missing Disney+ series to the dataset:
- The Falcon and the Winter Soldier
- Ms. Marvel
- She-Hulk: Attorney at Law
- Secret Invasion
- Ironheart
"""

import json
from pathlib import Path

# File paths
WATCHLIST_EN = Path("watchlist.en.json")
WATCHLIST_NL = Path("watchlist.nl.json")

# New series data (English)
NEW_SERIES_EN = [
    {
        "key": "61",
        "title": "The Falcon and the Winter Soldier",
        "kind": "Series",
        "runtime": "~5 hours",
        "bonus": False,
        "phase": 4,
        "saga": ["multiverse-saga", "doomsday"],
        "what": "Following the events of Avengers: Endgame, Sam Wilson/Falcon and Bucky Barnes/Winter Soldier team up in a global adventure that tests their abilities and their patience.",
        "why": "Shows Sam Wilson's journey to becoming the new Captain America, essential for understanding his role in Brave New World. Introduces the Flag-Smashers and explores the legacy of the super-soldier serum.",
        "when": "2023 - Six months after Endgame. Sam struggles with Steve Rogers' legacy while Bucky seeks redemption.",
        "who": "Anthony Mackie as Sam Wilson/Falcon, Sebastian Stan as Bucky Barnes/Winter Soldier, Daniel Brühl as Zemo, Emily VanCamp as Sharon Carter, Wyatt Russell as John Walker",
        "officialUrl": "https://www.marvel.com/tv-shows/the-falcon-and-the-winter-soldier/1",
        "chronologicalOrder": 46,
        "localImage": "./assets/posters/61.jpg",
        "imageUrl": "https://cdn.marvel.com/content/2x/falcws_lob_crd_03.jpg",
        "releaseDate": "2021-03-19",
        "earth": "Earth-199999 / Earth-616",
        "status": "Optional"
    },
    {
        "key": "62",
        "title": "Ms. Marvel",
        "kind": "Series",
        "runtime": "~4 hours",
        "bonus": False,
        "phase": 4,
        "saga": ["multiverse-saga", "doomsday"],
        "what": "Kamala Khan, a Muslim American teenager from Jersey City, discovers she has polymorphic powers and must balance her superhero identity with her family and cultural heritage.",
        "why": "Introduces Kamala Khan/Ms. Marvel, who becomes a key member of The Marvels team. Her powers connect to the Noor dimension and the Quantum Bands, linking to Captain Marvel's story.",
        "when": "2025 - Kamala discovers her powers and learns about her family's connection to the Partition of India and the Clandestines.",
        "who": "Iman Vellani as Kamala Khan/Ms. Marvel, Aramis Knight, Saagar Shaikh, Rish Shah, Zenobia Shroff, Mohan Kapur, Matt Lintz, Yasmeen Fletcher",
        "officialUrl": "https://www.marvel.com/tv-shows/ms-marvel/1",
        "chronologicalOrder": 58,
        "localImage": "./assets/posters/62.jpg",
        "imageUrl": "https://cdn.marvel.com/content/2x/msmarvel_lob_crd_04.jpg",
        "releaseDate": "2022-06-08",
        "earth": "Earth-199999 / Earth-616",
        "status": "Optional"
    },
    {
        "key": "63",
        "title": "She-Hulk: Attorney at Law",
        "kind": "Series",
        "runtime": "~6 hours",
        "bonus": False,
        "phase": 4,
        "saga": ["multiverse-saga", "doomsday"],
        "what": "Jennifer Walters, an attorney specializing in superhuman-oriented legal cases, must navigate the complicated life of a single 30-something who also happens to be a green 6-foot-7-inch superpowered Hulk.",
        "why": "Introduces She-Hulk and expands the legal side of the superhuman world. Features Daredevil's return and explores the consequences of superhero actions through a legal lens.",
        "when": "2025 - Jennifer Walters gains Hulk powers from Bruce Banner's blood and starts her superhuman law division.",
        "who": "Tatiana Maslany as Jennifer Walters/She-Hulk, Mark Ruffalo as Bruce Banner/Hulk, Tim Roth as Emil Blonsky/Abomination, Benedict Wong as Wong, Charlie Cox as Matt Murdock/Daredevil",
        "officialUrl": "https://www.marvel.com/tv-shows/she-hulk-attorney-at-law/1",
        "chronologicalOrder": 57,
        "localImage": "./assets/posters/63.jpg",
        "imageUrl": "https://cdn.marvel.com/content/2x/shehulk_lob_crd_04.jpg",
        "releaseDate": "2022-08-18",
        "earth": "Earth-199999 / Earth-616",
        "status": "Optional"
    },
    {
        "key": "64",
        "title": "Secret Invasion",
        "kind": "Series",
        "runtime": "~5 hours",
        "bonus": False,
        "phase": 5,
        "saga": ["multiverse-saga", "doomsday"],
        "what": "Nick Fury learns of a clandestine invasion of Earth by a faction of shapeshifting Skrulls. He joins allies including Everett Ross, Maria Hill, and Talos to race against time to thwart the invasion.",
        "why": "Reveals the Skrull infiltration of Earth and shows Fury's struggle with trust. The series has major consequences for the MCU's political landscape and sets up future conflicts.",
        "when": "2026 - Present-day MCU. Fury returns from space to deal with the Skrull threat on Earth.",
        "who": "Samuel L. Jackson as Nick Fury, Ben Mendelsohn as Talos, Cobie Smulders as Maria Hill, Martin Freeman as Everett Ross, Kingsley Ben-Adir as Gravik, Emilia Clarke as G'iah, Olivia Colman as Sonya Falsworth",
        "officialUrl": "https://www.marvel.com/tv-shows/secret-invasion/1",
        "chronologicalOrder": 65,
        "localImage": "./assets/posters/64.jpg",
        "imageUrl": "https://cdn.marvel.com/content/2x/secretinvasion_lob_crd_04.jpg",
        "releaseDate": "2023-06-21",
        "earth": "Earth-199999 / Earth-616",
        "status": "Optional"
    },
    {
        "key": "65",
        "title": "Ironheart",
        "kind": "Series",
        "runtime": "~6 hours",
        "bonus": False,
        "phase": 6,
        "saga": ["multiverse-saga", "doomsday"],
        "what": "Set after Black Panther: Wakanda Forever, Riri Williams returns to Chicago where her genius for building iron suits puts her in conflict with the mysterious Parker Robbins aka The Hood.",
        "why": "Continues Riri Williams' story from Wakanda Forever and explores the intersection of technology and magic. Sets up her role in future Avengers films.",
        "when": "2025 - Riri returns to Chicago after her adventures in Wakanda and faces new threats combining tech and mysticism.",
        "who": "Dominique Thorne as Riri Williams/Ironheart, Anthony Ramos as Parker Robbins/The Hood, Lyric Ross, Alden Ehrenreich, Manny Montana",
        "officialUrl": "https://www.marvel.com/tv-shows/ironheart/1",
        "chronologicalOrder": 75,
        "localImage": "./assets/posters/65.jpg",
        "imageUrl": "https://cdn.marvel.com/content/2x/ironheart_lob_crd_04.jpg",
        "releaseDate": "2025-06-24",
        "earth": "Earth-199999 / Earth-616",
        "status": "Optional"
    }
]

# Dutch translations
NEW_SERIES_NL = [
    {
        "key": "61",
        "title": "The Falcon and the Winter Soldier",
        "kind": "Series",
        "runtime": "~5 uur",
        "bonus": False,
        "phase": 4,
        "saga": ["multiverse-saga", "doomsday"],
        "what": "Na de gebeurtenissen van Avengers: Endgame werken Sam Wilson/Falcon en Bucky Barnes/Winter Soldier samen in een wereldwijd avontuur dat hun vaardigheden en geduld op de proef stelt.",
        "why": "Toont Sam Wilson's reis om de nieuwe Captain America te worden, essentieel voor het begrijpen van zijn rol in Brave New World. Introduceert de Flag-Smashers en verkent de erfenis van het super-soldaten serum.",
        "when": "2023 - Zes maanden na Endgame. Sam worstelt met Steve Rogers' erfenis terwijl Bucky verlossing zoekt.",
        "who": "Anthony Mackie als Sam Wilson/Falcon, Sebastian Stan als Bucky Barnes/Winter Soldier, Daniel Brühl als Zemo, Emily VanCamp als Sharon Carter, Wyatt Russell als John Walker",
        "officialUrl": "https://www.marvel.com/tv-shows/the-falcon-and-the-winter-soldier/1",
        "chronologicalOrder": 46,
        "localImage": "./assets/posters/61.jpg",
        "imageUrl": "https://cdn.marvel.com/content/2x/falcws_lob_crd_03.jpg",
        "releaseDate": "2021-03-19",
        "earth": "Earth-199999 / Earth-616",
        "status": "Optional"
    },
    {
        "key": "62",
        "title": "Ms. Marvel",
        "kind": "Series",
        "runtime": "~4 uur",
        "bonus": False,
        "phase": 4,
        "saga": ["multiverse-saga", "doomsday"],
        "what": "Kamala Khan, een moslim-Amerikaanse tiener uit Jersey City, ontdekt dat ze polymorfe krachten heeft en moet haar superhelden-identiteit in balans brengen met haar familie en culturele erfgoed.",
        "why": "Introduceert Kamala Khan/Ms. Marvel, die een belangrijk lid wordt van The Marvels team. Haar krachten zijn verbonden met de Noor dimensie en de Quantum Bands, wat linkt aan Captain Marvel's verhaal.",
        "when": "2025 - Kamala ontdekt haar krachten en leert over de connectie van haar familie met de Deling van India en de Clandestines.",
        "who": "Iman Vellani als Kamala Khan/Ms. Marvel, Aramis Knight, Saagar Shaikh, Rish Shah, Zenobia Shroff, Mohan Kapur, Matt Lintz, Yasmeen Fletcher",
        "officialUrl": "https://www.marvel.com/tv-shows/ms-marvel/1",
        "chronologicalOrder": 58,
        "localImage": "./assets/posters/62.jpg",
        "imageUrl": "https://cdn.marvel.com/content/2x/msmarvel_lob_crd_04.jpg",
        "releaseDate": "2022-06-08",
        "earth": "Earth-199999 / Earth-616",
        "status": "Optional"
    },
    {
        "key": "63",
        "title": "She-Hulk: Attorney at Law",
        "kind": "Series",
        "runtime": "~6 uur",
        "bonus": False,
        "phase": 4,
        "saga": ["multiverse-saga", "doomsday"],
        "what": "Jennifer Walters, een advocaat gespecialiseerd in superhuman-georiënteerde rechtszaken, moet het gecompliceerde leven navigeren van een alleenstaande dertiger die ook een groene 2 meter lange superkrachtige Hulk is.",
        "why": "Introduceert She-Hulk en breidt de juridische kant van de superhuman wereld uit. Bevat Daredevil's terugkeer en verkent de gevolgen van superhelden acties door een juridische lens.",
        "when": "2025 - Jennifer Walters krijgt Hulk krachten van Bruce Banner's bloed en start haar superhuman juridische afdeling.",
        "who": "Tatiana Maslany als Jennifer Walters/She-Hulk, Mark Ruffalo als Bruce Banner/Hulk, Tim Roth als Emil Blonsky/Abomination, Benedict Wong als Wong, Charlie Cox als Matt Murdock/Daredevil",
        "officialUrl": "https://www.marvel.com/tv-shows/she-hulk-attorney-at-law/1",
        "chronologicalOrder": 57,
        "localImage": "./assets/posters/63.jpg",
        "imageUrl": "https://cdn.marvel.com/content/2x/shehulk_lob_crd_04.jpg",
        "releaseDate": "2022-08-18",
        "earth": "Earth-199999 / Earth-616",
        "status": "Optional"
    },
    {
        "key": "64",
        "title": "Secret Invasion",
        "kind": "Series",
        "runtime": "~5 uur",
        "bonus": False,
        "phase": 5,
        "saga": ["multiverse-saga", "doomsday"],
        "what": "Nick Fury ontdekt een geheime invasie van de Aarde door een factie van gedaanteverwisselende Skrulls. Hij sluit zich aan bij bondgenoten waaronder Everett Ross, Maria Hill en Talos om de invasie te verijdelen.",
        "why": "Onthult de Skrull infiltratie van de Aarde en toont Fury's worsteling met vertrouwen. De serie heeft grote gevolgen voor het politieke landschap van de MCU en zet toekomstige conflicten op.",
        "when": "2026 - Huidig MCU tijdperk. Fury keert terug uit de ruimte om de Skrull dreiging op Aarde aan te pakken.",
        "who": "Samuel L. Jackson als Nick Fury, Ben Mendelsohn als Talos, Cobie Smulders als Maria Hill, Martin Freeman als Everett Ross, Kingsley Ben-Adir als Gravik, Emilia Clarke als G'iah, Olivia Colman als Sonya Falsworth",
        "officialUrl": "https://www.marvel.com/tv-shows/secret-invasion/1",
        "chronologicalOrder": 65,
        "localImage": "./assets/posters/64.jpg",
        "imageUrl": "https://cdn.marvel.com/content/2x/secretinvasion_lob_crd_04.jpg",
        "releaseDate": "2023-06-21",
        "earth": "Earth-199999 / Earth-616",
        "status": "Optional"
    },
    {
        "key": "65",
        "title": "Ironheart",
        "kind": "Series",
        "runtime": "~6 uur",
        "bonus": False,
        "phase": 6,
        "saga": ["multiverse-saga", "doomsday"],
        "what": "Na Black Panther: Wakanda Forever keert Riri Williams terug naar Chicago waar haar genialiteit voor het bouwen van ijzeren pakken haar in conflict brengt met de mysterieuze Parker Robbins aka The Hood.",
        "why": "Vervolgt Riri Williams' verhaal uit Wakanda Forever en verkent de kruising van technologie en magie. Zet haar rol in toekomstige Avengers films op.",
        "when": "2025 - Riri keert terug naar Chicago na haar avonturen in Wakanda en wordt geconfronteerd met nieuwe bedreigingen die tech en mysticisme combineren.",
        "who": "Dominique Thorne als Riri Williams/Ironheart, Anthony Ramos als Parker Robbins/The Hood, Lyric Ross, Alden Ehrenreich, Manny Montana",
        "officialUrl": "https://www.marvel.com/tv-shows/ironheart/1",
        "chronologicalOrder": 75,
        "localImage": "./assets/posters/65.jpg",
        "imageUrl": "https://cdn.marvel.com/content/2x/ironheart_lob_crd_04.jpg",
        "releaseDate": "2025-06-24",
        "earth": "Earth-199999 / Earth-616",
        "status": "Optional"
    }
]

def add_series(file_path: Path, new_series: list, lang: str) -> None:
    """Add new series to dataset."""
    print(f"\n📝 Processing {file_path.name} ({lang})...")
    
    # Load data
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Add new series
    added = 0
    for series in new_series:
        # Check if already exists
        if any(item['key'] == series['key'] for item in data['items']):
            print(f"  ⚠️  {series['title']} (key {series['key']}) already exists, skipping")
        else:
            data['items'].append(series)
            added += 1
            print(f"  ✅ Added {series['title']} (key {series['key']})")
    
    # Update counts
    data['count'] = len(data['items'])
    data['generatedAt'] = "2026-05-04T14:40:00.000000Z"
    
    # Write updated data
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"  📊 Total items: {data['count']} (+{added})")

def main():
    print("=" * 80)
    print("📺 Adding 5 Disney+ Series to Dataset")
    print("=" * 80)
    print("\nSeries to add:")
    for series in NEW_SERIES_EN:
        print(f"  - {series['title']} ({series['releaseDate']})")
    
    # Add to English dataset
    add_series(WATCHLIST_EN, NEW_SERIES_EN, "English")
    
    # Add to Dutch dataset
    add_series(WATCHLIST_NL, NEW_SERIES_NL, "Nederlands")
    
    print("\n" + "=" * 80)
    print("✅ Disney+ series addition complete!")
    print("=" * 80)
    print("\n🎯 Next steps:")
    print("   1. Download poster images (61.jpg - 65.jpg)")
    print("   2. Update marvel-images.json")
    print("   3. Test the app")
    print("   4. Commit and release")

if __name__ == "__main__":
    main()

# Made with Bob
