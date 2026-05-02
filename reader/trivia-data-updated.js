/* ============================================
   MCU DOOMSDAY READER - COMPREHENSIVE TRIVIA DATA
   Updated for chronological numbering (1-45)
   ============================================ */

const triviaData = {
  // ===== PHASE 1 (2008-2012) =====
  
  1: { // Iron Man (2008)
    postCredits: 1,
    scenes: ["Nick Fury approaches Tony Stark about the Avengers Initiative"],
    trivia: [
      "The film that started the MCU and changed cinema forever",
      "Robert Downey Jr. improvised the iconic 'I am Iron Man' line at the end",
      "Jeff Bridges shaved his head for the role of Obadiah Stane",
      "The Mark I armor was a practical suit that weighed 90 pounds",
      "Gwyneth Paltrow's blue dress in the final scene cost $5,000"
    ],
    easterEggs: [
      "Captain America's shield can be seen on Tony's workbench in his workshop",
      "The Ten Rings terrorist organization connects to Shang-Chi",
      "J.A.R.V.I.S. is named after Edwin Jarvis, Howard Stark's butler from the comics"
    ],
    connections: ["Iron Man 2", "The Avengers", "Iron Man 3"],
    stanLeeCameo: "Tony Stark mistakes Stan Lee for Hugh Hefner at a party and says 'You look great, Hef!'"
  },

  2: { // The Incredible Hulk (2008)
    postCredits: 1,
    scenes: ["Tony Stark meets General Ross at a bar, hinting at the Avengers Initiative"],
    trivia: [
      "Edward Norton was replaced by Mark Ruffalo in later films",
      "The opening credits sequence replaces the entire origin story",
      "Lou Ferrigno (original TV Hulk) voices the Hulk and has a cameo as a security guard",
      "The film was shot in Toronto, standing in for New York City",
      "Tim Roth performed many of his own stunts as Emil Blonsky"
    ],
    easterEggs: [
      "Captain America can be seen frozen in ice in a deleted scene",
      "Nick Fury appears on a monitor in a deleted scene",
      "The Super Soldier Serum connects directly to Captain America"
    ],
    connections: ["The Avengers", "She-Hulk", "Captain America: Civil War"],
    stanLeeCameo: "Drinks a soda contaminated with Bruce Banner's blood, inadvertently poisoning himself"
  },

  3: { // Iron Man 2 (2010)
    postCredits: 1,
    scenes: ["Agent Coulson discovers Thor's hammer in the New Mexico desert"],
    trivia: [
      "Mickey Rourke did not wear prosthetic teeth; those are his real teeth",
      "Scarlett Johansson trained for months to perform Black Widow's fight scenes",
      "The Monaco Grand Prix sequence took two weeks to film",
      "Sam Rockwell improvised much of Justin Hammer's dialogue and dance moves",
      "The film introduces S.H.I.E.L.D. more prominently than any previous MCU film"
    ],
    easterEggs: [
      "A map in Fury's office shows 'hot spots' including Wakanda and Atlantis",
      "The Stark Expo design is based on the 1964 World's Fair",
      "Captain America's shield is used to level Tony's particle accelerator"
    ],
    connections: ["Thor", "The Avengers", "Black Widow"],
    stanLeeCameo: "Mistaken for Larry King at the Stark Expo, Tony says 'Hi, Larry!'"
  },

  4: { // Thor (2011)
    postCredits: 2,
    scenes: [
      "Loki manipulates Erik Selvig while possessing the Tesseract",
      "Thor returns to Earth (only in some versions)"
    ],
    trivia: [
      "Chris Hemsworth gained 20 pounds of muscle for the role",
      "Natalie Portman's character was originally going to be a nurse, not a scientist",
      "The Bifrost sound effect is a didgeridoo",
      "Tom Hiddleston originally auditioned for Thor, not Loki",
      "The film's New Mexico town was built as a set in Galisteo, New Mexico"
    ],
    easterEggs: [
      "Hawkeye makes his first MCU appearance as a S.H.I.E.L.D. agent",
      "The Infinity Gauntlet can be seen in Odin's vault (later revealed as a fake)",
      "Donald Blake's name appears on a hospital ID tag"
    ],
    connections: ["The Avengers", "Thor: The Dark World", "Thor: Ragnarok"],
    stanLeeCameo: "Attempts to pull Thor's hammer from the ground with his pickup truck, failing spectacularly"
  },

  5: { // Captain America: The First Avenger (2011)
    postCredits: 1,
    scenes: ["The Avengers teaser trailer"],
    trivia: [
      "Chris Evans initially turned down the role three times",
      "The skinny Steve Rogers effect used a combination of CGI and body doubles",
      "Hayley Atwell's red lipstick became iconic and was specially created for the film",
      "The film's budget was $140 million, one of the most expensive at the time",
      "Sebastian Stan (Bucky) signed a nine-picture deal with Marvel"
    ],
    easterEggs: [
      "The original Human Torch (android) is displayed at the Stark Expo",
      "Arnim Zola's consciousness transfer hints at his future as an AI",
      "The Tesseract is revealed to be an Infinity Stone"
    ],
    connections: ["The Avengers", "Captain America: The Winter Soldier", "Avengers: Endgame"],
    stanLeeCameo: "A general at the medal ceremony who mistakes Steve Rogers for someone else"
  },

  6: { // The Avengers (2012)
    postCredits: 2,
    scenes: [
      "The Avengers eat shawarma in silence",
      "Thanos is revealed as the mastermind behind Loki's invasion"
    ],
    trivia: [
      "The shawarma scene was shot after the premiere; Chris Evans wore a prosthetic jaw to hide his beard",
      "Robert Downey Jr. hid snacks around the set and ate during takes",
      "The Battle of New York was filmed in Cleveland, Ohio",
      "Joss Whedon wrote the script in three weeks",
      "Mark Ruffalo is the first actor to play both Bruce Banner and the Hulk via motion capture"
    ],
    easterEggs: [
      "Thanos' appearance sets up the Infinity Saga",
      "The Chitauri are connected to the Kree Empire",
      "Tony's 'genius, billionaire, playboy, philanthropist' line was improvised"
    ],
    connections: ["Iron Man 3", "Thor: The Dark World", "Avengers: Age of Ultron"],
    stanLeeCameo: "Interviewed on TV, skeptical about superheroes in New York: 'Superheroes in New York? Give me a break!'"
  },

  // ===== PHASE 2 (2013-2015) =====

  7: { // Iron Man 3 (2013)
    postCredits: 1,
    scenes: ["Tony Stark recounts his story to Bruce Banner, who fell asleep"],
    trivia: [
      "The Mandarin twist was one of the most controversial decisions in MCU history",
      "Robert Downey Jr. suffered an ankle injury during filming",
      "The barrel of monkeys sequence was performed by actual skydivers",
      "Shane Black directed and brought his signature Christmas setting",
      "The film grossed over $1.2 billion worldwide"
    ],
    easterEggs: [
      "The Ten Rings organization returns, connecting to Iron Man and Shang-Chi",
      "Harley Keener returns in Avengers: Endgame",
      "J.A.R.V.I.S. is destroyed, leading to the creation of Vision"
    ],
    connections: ["Avengers: Age of Ultron", "Spider-Man: Homecoming", "Shang-Chi"],
    stanLeeCameo: "A beauty pageant judge holding a '10' scorecard as Tony's suits explode"
  },

  8: { // Thor: The Dark World (2013)
    postCredits: 2,
    scenes: [
      "Sif and Volstagg deliver the Aether to the Collector",
      "Thor returns to Earth to reunite with Jane"
    ],
    trivia: [
      "Loki's death scene made Tom Hiddleston cry during filming",
      "Natalie Portman's scenes were partially reshot with a body double",
      "The film introduces the Reality Stone (Aether)",
      "Chris O'Dowd was originally cast as a love interest for Jane but was cut",
      "The Dark Elves' language was created specifically for the film"
    ],
    easterEggs: [
      "The Collector's museum contains a Chitauri, a Dark Elf, and other MCU artifacts",
      "Loki's 'death' is revealed to be a trick in Thor: Ragnarok",
      "The Convergence event connects to the multiverse concept"
    ],
    connections: ["Guardians of the Galaxy", "Thor: Ragnarok", "Avengers: Infinity War"],
    stanLeeCameo: "A mental patient in the asylum where Erik Selvig is held, asking for his shoe back"
  },

  9: { // Captain America: The Winter Soldier (2014)
    postCredits: 2,
    scenes: [
      "Baron von Strucker experiments on Quicksilver and Scarlet Witch with Loki's scepter",
      "Bucky visits the Captain America exhibit at the Smithsonian"
    ],
    trivia: [
      "Considered one of the best MCU films and a political thriller",
      "The Russo Brothers' first MCU film",
      "Robert Redford's first superhero film role",
      "The highway fight scene took two weeks to film",
      "Hydra's infiltration of S.H.I.E.L.D. affected Agents of S.H.I.E.L.D. TV series simultaneously"
    ],
    easterEggs: [
      "Stephen Strange is mentioned as a target by Zola's algorithm",
      "Arnim Zola returns as a computer consciousness",
      "Bucky's metal arm is Wakandan technology (revealed later)"
    ],
    connections: ["Avengers: Age of Ultron", "Captain America: Civil War", "Black Panther"],
    stanLeeCameo: "A Smithsonian security guard who discovers Captain America's stolen uniform"
  },

  10: { // Guardians of the Galaxy (2014)
    postCredits: 2,
    scenes: [
      "Baby Groot dances to 'I Want You Back'",
      "Howard the Duck appears in the Collector's destroyed museum"
    ],
    trivia: [
      "Chris Pratt lost 60 pounds for the role of Star-Lord",
      "Vin Diesel recorded 'I am Groot' in multiple languages",
      "The Awesome Mix Vol. 1 soundtrack became a cultural phenomenon",
      "James Gunn fought to keep the film's humor and music",
      "Bradley Cooper voiced Rocket Raccoon without ever being on set"
    ],
    easterEggs: [
      "The Collector's museum contains a Chitauri, a Dark Elf, and Cosmo the space dog",
      "Thanos sits in a floating chair, a reference to his comic book throne",
      "The Power Stone is the first Infinity Stone explicitly named"
    ],
    connections: ["Guardians of the Galaxy Vol. 2", "Avengers: Infinity War", "Thor: Love and Thunder"],
    stanLeeCameo: "A ladies' man on Xandar, flirting with a young woman and calling her 'beautiful'"
  },

  11: { // Avengers: Age of Ultron (2015)
    postCredits: 1,
    scenes: ["Thanos retrieves the Infinity Gauntlet, saying 'Fine, I'll do it myself'"],
    trivia: [
      "The party scene was filmed at a real location in England",
      "Joss Whedon fought with Marvel executives over the film's length and content",
      "The Hulkbuster armor weighs over 1,700 pounds in real life",
      "Quicksilver's death was controversial and unexpected",
      "The film introduces Vision, who wields Mjolnir"
    ],
    easterEggs: [
      "Wakanda is mentioned as the source of vibranium",
      "Thor's vision in the cave hints at the Infinity Stones",
      "The Mind Stone is revealed to be in Loki's scepter"
    ],
    connections: ["Captain America: Civil War", "Black Panther", "Avengers: Infinity War"],
    stanLeeCameo: "A World War II veteran at the Avengers' party, trying to drink Thor's Asgardian liquor"
  },

  12: { // Ant-Man (2015)
    postCredits: 2,
    scenes: [
      "Falcon meets with Captain America and Bucky, mentioning 'a guy who can shrink'",
      "Hope van Dyne is shown the Wasp suit"
    ],
    trivia: [
      "Edgar Wright left the project due to creative differences",
      "Paul Rudd co-wrote the screenplay",
      "Michael Peña's storytelling scenes were improvised",
      "The Thomas the Tank Engine fight was a fan-favorite moment",
      "The film introduces the Quantum Realm, crucial to Endgame"
    ],
    easterEggs: [
      "Howard Stark and Peggy Carter appear in the opening scene",
      "The Falcon fight connects directly to Civil War",
      "Hank Pym mentions his wife Janet being lost in the Quantum Realm"
    ],
    connections: ["Captain America: Civil War", "Ant-Man and the Wasp", "Avengers: Endgame"],
    stanLeeCameo: "A bartender who serves Luis and comments on his story"
  },

  // ===== PHASE 3 (2016-2019) - Existing trivia remapped =====

  13: { // Captain America: Civil War (2016)
    postCredits: 2,
    scenes: [
      "Bucky is placed in cryogenic sleep in Wakanda",
      "Peter Parker tests his new web-shooters"
    ],
    trivia: [
      "Considered 'Avengers 2.5' due to its large cast",
      "The airport battle scene took weeks to choreograph",
      "Spider-Man's introduction was kept secret until the trailer",
      "Black Panther's debut led to his solo film",
      "The Sokovia Accords divide the Avengers permanently"
    ],
    easterEggs: [
      "Wakanda is revealed as a technologically advanced nation",
      "Zemo's plan is one of the most successful villain plots in the MCU",
      "The rift between Tony and Steve sets up Infinity War"
    ],
    connections: ["Black Panther", "Spider-Man: Homecoming", "Avengers: Infinity War"],
    stanLeeCameo: "A FedEx delivery man who mispronounces Tony Stark's name as 'Tony Stank'"
  },

  14: { // Doctor Strange (2016) - OLD KEY 1
    postCredits: 2,
    scenes: [
      "Thor appears asking for Strange's help to find Odin",
      "Mordo confronts Jonathan Pangborn and steals his magic"
    ],
    trivia: [
      "Benedict Cumberbatch performed many of his own stunts",
      "The Ancient One's death scene was shot in one take",
      "The film features over 1,000 VFX shots",
      "Benedict Cumberbatch performed the motion capture for Dormammu",
      "The Cloak of Levitation's personality was inspired by Aladdin's Magic Carpet"
    ],
    easterEggs: [
      "A file mentions a '35-year-old Air Force Colonel'—War Machine reference",
      "The Eye of Agamotto contains the Time Stone",
      "The Sanctum Sanctorum address is 177A Bleecker Street"
    ],
    connections: ["Thor: Ragnarok", "Avengers: Infinity War", "Spider-Man: No Way Home"],
    stanLeeCameo: "On a bus, laughing while reading 'The Doors of Perception' as Strange crashes into the window"
  },

  15: { // Guardians of the Galaxy Vol. 2 (2017)
    postCredits: 5,
    scenes: [
      "Kraglin learns to use Yondu's arrow",
      "Ravager leaders reunite for Yondu's funeral",
      "Ayesha creates Adam Warlock",
      "Teenage Groot acts rebellious",
      "Stan Lee talks to the Watchers"
    ],
    trivia: [
      "Kurt Russell is Chris Pratt's real-life childhood hero",
      "Baby Groot's dance was motion-captured from James Gunn",
      "The film explores Star-Lord's celestial heritage",
      "Yondu's funeral is one of the most emotional MCU moments",
      "The soundtrack features 'Guardians Inferno' by David Hasselhoff"
    ],
    easterEggs: [
      "Stan Lee's cameo confirms he's been the same character in all his appearances",
      "Adam Warlock's cocoon sets up Vol. 3",
      "Ego's planet contains thousands of skeletons of his children"
    ],
    connections: ["Avengers: Infinity War", "Thor: Love and Thunder", "Guardians of the Galaxy Vol. 3"],
    stanLeeCameo: "In a spacesuit, telling stories to the Watchers about his past adventures"
  },

  16: { // Spider-Man: Homecoming (2017) - OLD KEY 2
    postCredits: 2,
    scenes: [
      "Adrian Toomes protects Spider-Man's identity in prison",
      "Captain America's patience PSA (joke scene)"
    ],
    trivia: [
      "Tom Holland did his own stunts including the Washington Monument climb",
      "The film has over 2,800 VFX shots",
      "Donald Glover's character is Miles Morales' uncle in the comics",
      "Tom Holland went undercover at a Bronx high school for three days",
      "The title 'Homecoming' refers to both the dance and Spider-Man's MCU return"
    ],
    easterEggs: [
      "The mask Peter wears is a reference to the 1960s Spider-Man cartoon",
      "Damage Control is introduced as a cleanup organization",
      "The Avengers Tower is visible in the New York skyline"
    ],
    connections: ["Avengers: Infinity War", "Spider-Man: Far From Home", "Spider-Man: No Way Home"],
    stanLeeCameo: "A neighbor named Gary who yells at Peter for disturbing the neighborhood"
  },

  17: { // Thor: Ragnarok (2017) - OLD KEY 6
    postCredits: 2,
    scenes: [
      "Thor and Loki's ship is approached by Thanos' vessel",
      "Grandmaster faces angry revolutionaries"
    ],
    trivia: [
      "80% of the dialogue was improvised",
      "Taika Waititi voiced Korg via motion capture",
      "The film was inspired by 1980s sci-fi aesthetics",
      "The 'help me' play scene was Chris Hemsworth's idea",
      "Cate Blanchett performed her own stunts as Hela"
    ],
    easterEggs: [
      "The faces on Grandmaster's tower include Beta Ray Bill and Man-Thing",
      "Loki's play features Matt Damon as Loki",
      "The Hulk has been on Sakaar for two years (time dilation)"
    ],
    connections: ["Avengers: Infinity War", "Thor: Love and Thunder", "Loki"],
    stanLeeCameo: "The barber on Sakaar who cuts Thor's hair with a terrifying blade contraption"
  },

  18: { // Black Panther (2018) - OLD KEY 3
    postCredits: 2,
    scenes: [
      "T'Challa reveals Wakanda's true nature to the UN",
      "Bucky Barnes awakens in Wakanda"
    ],
    trivia: [
      "First superhero film nominated for Best Picture at the Oscars",
      "Wakandan language is based on Xhosa",
      "The film won 3 Academy Awards",
      "John Kani speaks Xhosa fluently",
      "The South Korea car chase used a real Lexus LC 500"
    ],
    easterEggs: [
      "Shuri calls Ross 'another broken white boy,' referencing Bucky",
      "Killmonger's scars represent his kills",
      "The heart-shaped herb connects to the Panther God Bast"
    ],
    connections: ["Avengers: Infinity War", "Black Panther: Wakanda Forever", "Captain America: Civil War"],
    stanLeeCameo: "A 'thirsty' gambler in the South Korean casino who takes T'Challa's winnings"
  },

  19: { // Avengers: Infinity War (2018) - OLD KEY 7
    postCredits: 1,
    scenes: ["Nick Fury sends a distress signal to Captain Marvel before being dusted"],
    trivia: [
      "Largest cast in MCU history at the time",
      "Robert Downey Jr. kept food hidden on set",
      "The Snap was filmed with actors not knowing who would be dusted",
      "Many actors were given fake scripts",
      "First film shot entirely using IMAX digital cameras"
    ],
    easterEggs: [
      "The 'arrested development' blue man in the Collector's collection",
      "Red Skull returns as the Soul Stone's keeper",
      "Thor's new weapon Stormbreaker is more powerful than Mjolnir"
    ],
    connections: ["Avengers: Endgame", "Captain Marvel", "Spider-Man: Far From Home"],
    stanLeeCameo: "Peter Parker's school bus driver: 'What's the matter with you kids? You never seen a spaceship before?'"
  },

  20: { // Ant-Man and the Wasp (2018) - OLD KEY 5
    postCredits: 2,
    scenes: [
      "Scott enters the Quantum Realm as the Pym family is dusted",
      "Giant ant plays drums (joke scene)"
    ],
    trivia: [
      "Michelle Pfeiffer's de-aging used no CGI, only makeup",
      "The film has over 2,000 VFX shots",
      "Paul Rudd improvised many of his lines",
      "Most 'macro' shots used specialized lenses",
      "The film takes place over just 48-72 hours"
    ],
    easterEggs: [
      "A microscopic city (Chronopolis) is visible in the Quantum Realm",
      "Ghost's quantum phasing connects to the multiverse",
      "The film ends exactly as the Snap happens"
    ],
    connections: ["Avengers: Endgame", "Ant-Man and the Wasp: Quantumania", "Loki"],
    stanLeeCameo: "A pedestrian whose car is shrunk: 'Well, the '60s were fun, but now I'm paying for it'"
  },

  21: { // Captain Marvel (2019)
    postCredits: 2,
    scenes: [
      "Carol Danvers appears at the Avengers compound asking 'Where's Fury?'",
      "Goose coughs up the Tesseract on Fury's desk"
    ],
    trivia: [
      "Set in the 1990s, it's a prequel to most MCU films",
      "Brie Larson trained for 9 months for the role",
      "The film introduces the Skrulls to the MCU",
      "Nick Fury loses his eye to Goose the Flerken",
      "The pager from Infinity War is explained"
    ],
    easterEggs: [
      "Young Phil Coulson and Nick Fury appear",
      "The Tesseract's journey from Captain America to Avengers is revealed",
      "Ronan the Accuser appears before Guardians of the Galaxy"
    ],
    connections: ["Avengers: Endgame", "The Marvels", "Secret Invasion"],
    stanLeeCameo: "On a train, reading the script for 'Mallrats' (a Kevin Smith film Stan appeared in)"
  },

  22: { // Avengers: Endgame (2019) - OLD KEY 8
    postCredits: 0,
    scenes: ["No traditional post-credits, only the sound of Tony forging his first armor"],
    trivia: [
      "Highest-grossing film of all time (briefly)",
      "The final battle took 3 months to film",
      "Robert Downey Jr. improvised 'I am Iron Man'",
      "Over 3,000 VFX shots",
      "Tony's death scene was filmed next to where RDJ first screen-tested",
      "At 3 hours 1 minute, it's the longest MCU film"
    ],
    easterEggs: [
      "The 1970s helmet is the original Ant-Man helmet from the comics",
      "Steve Rogers finally gets his dance with Peggy",
      "The funeral scene includes every major MCU character"
    ],
    connections: ["Spider-Man: Far From Home", "Loki", "WandaVision"],
    stanLeeCameo: "His final MCU cameo; a 1970s hippie driving past Camp Lehigh: 'Hey man, make love, not war!'"
  },

  23: { // Spider-Man: Far From Home (2019) - OLD KEY 9
    postCredits: 2,
    scenes: [
      "Mysterio reveals Spider-Man's identity to the world",
      "Nick Fury is revealed to be Talos; real Fury is in space"
    ],
    trivia: [
      "First MCU film set after Endgame",
      "Jake Gyllenhaal performed his own stunts",
      "The illusion sequences used practical effects and CGI",
      "The 'Peter Tingle' was kept in the final script",
      "First MCU movie where Peter's identity is outed"
    ],
    easterEggs: [
      "A tribute to fallen Avengers plays to 'I Will Always Love You'",
      "The Elementals are revealed to be illusions",
      "E.D.I.T.H. stands for 'Even Dead, I'm The Hero'"
    ],
    connections: ["Spider-Man: No Way Home", "Secret Invasion", "The Marvels"],
    stanLeeCameo: null
  },

  // ===== PHASE 4-6 (Existing trivia continues with updated keys) =====
  
  24: { // WandaVision - OLD KEY 10
    postCredits: 1,
    scenes: ["Wanda studies the Darkhold in astral form while hearing her children"],
    trivia: [
      "Each episode mimics a different sitcom era",
      "Elizabeth Olsen studied classic sitcoms for months",
      "Over 300 VFX shots per episode",
      "Paul Bettany acts with himself as Vision and White Vision",
      "First episode filmed in front of a live studio audience"
    ],
    easterEggs: [
      "Commercials represent Wanda's traumas (Stark Industries toaster)",
      "Agatha Harkness was the villain all along",
      "The Darkhold connects to Doctor Strange 2"
    ],
    connections: ["Doctor Strange in the Multiverse of Madness", "Agatha: Darkhold Diaries"],
    stanLeeCameo: null
  },

  25: { // Falcon & Winter Soldier - OLD KEY 11
    postCredits: 1,
    scenes: ["Sharon Carter sells government secrets"],
    trivia: [
      "Anthony Mackie did his own stunts",
      "Explores PTSD and racial issues",
      "Isaiah Bradley's story based on Tuskegee experiments",
      "Zemo's dance became a viral meme"
    ],
    easterEggs: [
      "The 'Big Three' (Androids, Aliens, Wizards) joke",
      "Sam's new Captain America suit is Wakandan",
      "Sharon is revealed as the Power Broker"
    ],
    connections: ["Captain America: Brave New World", "Thunderbolts*"],
    stanLeeCameo: null
  },

  26: { // Loki Season 1 & 2
    postCredits: 1,
    scenes: ["Loki finds himself in a branched timeline where Mobius doesn't recognize him"],
    trivia: [
      "Introduces the multiverse and Kang variants",
      "Tom Hiddleston's favorite MCU project",
      "The TVA design was inspired by 1970s sci-fi",
      "Sylvie is a female Loki variant"
    ],
    easterEggs: [
      "Throg (Frog Thor) appears in a jar",
      "The Void contains many MCU Easter eggs",
      "He Who Remains is a Kang variant"
    ],
    connections: ["Doctor Strange 2", "Ant-Man 3", "Avengers: The Kang Dynasty"],
    stanLeeCameo: null
  },

  27: { // Black Widow - OLD KEY 4
    postCredits: 1,
    scenes: ["Valentina recruits Yelena to kill Hawkeye"],
    trivia: [
      "Set between Civil War and Infinity War",
      "Florence Pugh did 90% of her own stunts",
      "The Red Room was inspired by real Soviet programs",
      "Florence Pugh's landing pose became a recurring gag",
      "Only film to take place in the past but released after Infinity Saga"
    ],
    easterEggs: [
      "The red 'Crimson Dynamo' action figure",
      "Taskmaster's identity twist",
      "Natasha's sacrifice in Endgame is referenced"
    ],
    connections: ["Hawkeye", "Thunderbolts*"],
    stanLeeCameo: null
  },

  28: { // Shang-Chi - OLD KEY 13
    postCredits: 2,
    scenes: [
      "Wong, Bruce Banner, and Carol Danvers analyze the Ten Rings",
      "Xialing takes over her father's organization"
    ],
    trivia: [
      "Simu Liu did 95% of his own stunts",
      "The bus fight was shot in one continuous take",
      "The Ten Rings' origin remains a mystery",
      "Simu Liu was cast after tweeting at Marvel in 2014"
    ],
    easterEggs: [
      "Trevor Slattery returns from Iron Man 3",
      "The Great Protector dragon",
      "Ta Lo connects to ancient MCU mythology"
    ],
    connections: ["The Marvels", "Shang-Chi 2"],
    stanLeeCameo: null
  },

  29: { // Hawkeye - OLD KEY 12
    postCredits: 1,
    scenes: ["Full 'Rogers: The Musical' performance"],
    trivia: [
      "Hailee Steinfeld did her own archery training",
      "Filmed during COVID-19 pandemic",
      "Lucky the Pizza Dog is from the comics",
      "Lucky's missing eye was added via CGI"
    ],
    easterEggs: [
      "Kate's purple suit is from the 2012 Matt Fraction comics",
      "Kingpin returns from Netflix's Daredevil",
      "The Tracksuit Mafia says 'bro' constantly"
    ],
    connections: ["Echo", "Daredevil: Born Again"],
    stanLeeCameo: null
  },

  30: { // Spider-Man: No Way Home - OLD KEY 17
    postCredits: 2,
    scenes: [
      "Eddie Brock returns to his universe, leaving a Venom symbiote",
      "Doctor Strange 2 trailer"
    ],
    trivia: [
      "Kept three Spider-Men secret until release",
      "Andrew Garfield lied for months",
      "Grossed over $1.9 billion",
      "Tom Holland cried seeing Tobey and Andrew",
      "Andrew lied to Emma Stone for over a year",
      "Features five villains from two franchises"
    ],
    easterEggs: [
      "Venom leaves a symbiote piece in the MCU",
      "The three Spider-Men compare web-shooters",
      "Matt Murdock appears as Peter's lawyer"
    ],
    connections: ["Doctor Strange 2", "Venom 3", "Spider-Man 4"],
    stanLeeCameo: null
  },

  31: { // Moon Knight - OLD KEY 16
    postCredits: 0,
    scenes: [],
    trivia: [
      "Oscar Isaac plays multiple personalities",
      "The show explores Egyptian mythology",
      "Filmed in Budapest and Jordan",
      "The suit transformations are practical effects"
    ],
    easterEggs: [
      "Khonshu is an actual Egyptian god",
      "The asylum scenes blur reality",
      "Jake Lockley is revealed in the finale"
    ],
    connections: ["Blade", "Midnight Sons"],
    stanLeeCameo: null
  },

  32: { // Doctor Strange 2 - OLD KEY 18
    postCredits: 2,
    scenes: [
      "Clea recruits Strange to fix an incursion",
      "Strange develops a third eye (joke scene)"
    ],
    trivia: [
      "Sam Raimi's first superhero film since Spider-Man 3",
      "Features the most variants",
      "John Krasinski as Reed Richards",
      "Bruce Campbell has his traditional Raimi cameo",
      "Sam Raimi brought horror style to MCU"
    ],
    easterEggs: [
      "Professor X with 90s cartoon theme",
      "The Illuminati members",
      "Zombie Strange uses the Darkhold"
    ],
    connections: ["Loki Season 2", "Avengers: Secret Wars"],
    stanLeeCameo: null
  },

  33: { // Thor: Love and Thunder - OLD KEY 14
    postCredits: 2,
    scenes: [
      "Zeus sends Hercules to kill Thor",
      "Jane Foster arrives in Valhalla"
    ],
    trivia: [
      "Christian Bale improvised much of Gorr's dialogue",
      "Natalie Portman trained for 10 months",
      "Features the most Guns N' Roses songs in any movie",
      "The Guardians appear briefly"
    ],
    easterEggs: [
      "Hercules is played by Brett Goldstein",
      "The Necrosword connects to Knull",
      "Gorr's daughter becomes Love"
    ],
    connections: ["Thor 5", "Hercules appearance"],
    stanLeeCameo: null
  },

  34: { // Black Panther: Wakanda Forever - OLD KEY 20
    postCredits: 1,
    scenes: ["Shuri meets T'Challa's son in Haiti"],
    trivia: [
      "Tribute to Chadwick Boseman throughout",
      "Namor speaks Mayan language",
      "Rihanna returned to music for soundtrack",
      "Rewritten after Boseman's passing",
      "Namor changed from Atlantis to Talokan"
    ],
    easterEggs: [
      "Talokan draws from Mayan/Aztec mythology",
      "Shuri becomes the new Black Panther",
      "Ironheart is introduced"
    ],
    connections: ["Ironheart", "Wakanda series"],
    stanLeeCameo: null
  },

  35: { // Ant-Man 3 - OLD KEY 19
    postCredits: 2,
    scenes: [
      "Kang variants gather in the Quantum Realm",
      "Loki and Mobius investigate a Kang variant in 1901"
    ],
    trivia: [
      "Introduces Kang the Conqueror",
      "Jonathan Majors plays multiple Kang variants",
      "Quantum Realm entirely CGI",
      "MODOK's design was controversial"
    ],
    easterEggs: [
      "The Council of Kangs",
      "MODOK is Darren Cross",
      "Cassie Lang becomes Stature"
    ],
    connections: ["Loki Season 2", "Avengers: The Kang Dynasty"],
    stanLeeCameo: null
  },

  36: { // The Marvels - OLD KEY 21
    postCredits: 1,
    scenes: ["Monica Rambeau in parallel universe with Binary and Beast"],
    trivia: [
      "Shortest MCU film at 105 minutes",
      "First musical number in MCU",
      "Kamala forms Young Avengers",
      "Three leads trained together"
    ],
    easterEggs: [
      "The Flerken kittens",
      "Binary appearance hints at X-Men",
      "Young Avengers assembly begins"
    ],
    connections: ["X-Men integration", "Young Avengers"],
    stanLeeCameo: null
  },

  37: { // Deadpool & Wolverine - OLD KEY 22
    postCredits: 1,
    scenes: ["Deadpool shows Johnny Storm footage"],
    trivia: [
      "First R-rated MCU film",
      "Hugh Jackman returns after Logan",
      "Integrates Fox X-Men into MCU",
      "Ryan Reynolds and Hugh Jackman improvised extensively"
    ],
    easterEggs: [
      "Multiple Fox characters return",
      "Blade, Elektra, Gambit appear",
      "TVA integration"
    ],
    connections: ["Avengers: Secret Wars", "X-Men reboot"],
    stanLeeCameo: null
  },

  38: { // Captain America: Brave New World - OLD KEY 23
    postCredits: 2,
    scenes: ["Expected Thunderbolts setup"],
    trivia: [
      "Anthony Mackie's first film as Captain America",
      "Harrison Ford as Red Hulk",
      "Serpent Society as villains",
      "Tim Blake Nelson returns as The Leader",
      "Harrison Ford joins MCU"
    ],
    easterEggs: [],
    connections: ["Thunderbolts*", "World War Hulk"],
    stanLeeCameo: null
  },

  39: { // Thunderbolts* - OLD KEY 24
    postCredits: 2,
    scenes: ["TBD"],
    trivia: [
      "Asterisk is intentional and mysterious",
      "Anti-heroes and reformed villains",
      "Florence Pugh returns",
      "Sebastian Stan returns",
      "Asterisk implies name change to Dark Avengers"
    ],
    easterEggs: [],
    connections: ["Captain America 4", "Avengers: Doomsday"],
    stanLeeCameo: null
  },

  40: { // Fantastic Four: First Steps - OLD KEY 25
    postCredits: 2,
    scenes: ["TBD"],
    trivia: [
      "Set in alternate 1960s timeline",
      "Introduces Marvel's First Family to MCU",
      "Galactus as the villain",
      "Period piece aesthetic"
    ],
    easterEggs: [],
    connections: ["Avengers: Doomsday", "Avengers: Secret Wars"],
    stanLeeCameo: null
  },

  41: { // Wonder Man - OLD KEY 26
    postCredits: 0,
    scenes: [],
    trivia: [
      "Simon Williams' Hollywood career",
      "Disney+ series format",
      "Connects to West Coast Avengers"
    ],
    easterEggs: [],
    connections: ["Young Avengers"],
    stanLeeCameo: null
  },

  42: { // Daredevil: Born Again S2 - OLD KEY 27
    postCredits: 0,
    scenes: [],
    trivia: [
      "Charlie Cox and Vincent D'Onofrio return",
      "18-episode season",
      "Continues Netflix storylines",
      "Darker, mature tone"
    ],
    easterEggs: [],
    connections: ["Echo", "Spider-Man 4"],
    stanLeeCameo: null
  },

  43: { // VisionQuest - OLD KEY 28
    postCredits: 0,
    scenes: [],
    trivia: [
      "White Vision's journey",
      "Explores synthetic life",
      "Paul Bettany returns"
    ],
    easterEggs: [],
    connections: ["WandaVision", "Young Avengers"],
    stanLeeCameo: null
  },

  44: { // Spider-Man: Brand New Day - OLD KEY 29
    postCredits: 2,
    scenes: ["TBD"],
    trivia: [
      "Tom Holland's fourth Spider-Man film",
      "Street-level story",
      "Deals with identity crisis aftermath"
    ],
    easterEggs: [],
    connections: ["Avengers: Doomsday"],
    stanLeeCameo: null
  },

  45: { // Avengers: Doomsday - OLD KEY 30
    postCredits: 2,
    scenes: ["TBD"],
    trivia: [
      "Robert Downey Jr. returns as Doctor Doom",
      "Largest MCU cast ever",
      "Directed by Russo Brothers",
      "Culmination of Multiverse Saga"
    ],
    easterEggs: [],
    connections: ["Avengers: Secret Wars"],
    stanLeeCameo: null
  }
};

// Export for use in main app
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { triviaData };
}

// Made with Bob
