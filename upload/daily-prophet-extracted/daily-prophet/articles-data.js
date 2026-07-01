// Shared Article Data for the Daily Prophet
const articlesData = [
    {
        id: "hogwarts-anomalies",
        title: "MAGICAL ANOMALIES DETECTED AT HOGWARTS CASTLE",
        subtitle: "Ministry Launches Secret Probe; Dumbledore Demands Autonomy for Hogwarts Staff",
        author: "Rita Skeeter, Special Correspondent",
        date: "Thursday, 2 July 2026",
        category: "Main Story",
        snippet: "Atmospheric disturbances and ancient energy spikes have been reported around the towers of Hogwarts. Sources inside the school speak of floating candelabras acting erratic and library books organizing themselves into ancient runic shapes.",
        content: [
            "In a shocking development that has sent ripples of concern through the corridors of the Ministry of Magic, unexplained atmospheric disturbances and ancient energy spikes have been reported around the towers of Hogwarts School of Witchcraft and Wizardry.",
            "Sources inside the school speak of floating candelabras acting erratic, dungeon temperatures dropping to freezing point within seconds, and library books organizing themselves into ancient runic shapes. Some students even claim to have seen ghost-like figures dancing in the courtyard that do not belong to the usual Hogwarts spectral residents.",
            "Minister for Magic Cornelius Fudge stated in an emergency press briefing early this morning, 'We have reason to believe that certain localized anomalies are occurring. We are dispatching a team from the Department of Mysteries to ensure the safety of our children.' Fudge refused to answer questions regarding whether these anomalies were linked to darker forces or residual spells from bygone eras.",
            "However, Headmaster Albus Dumbledore remains firm in his stance. In a letter sent by owl to the Daily Prophet, Dumbledore wrote: 'Hogwarts has survived centuries of magical evolution. A temporary excess of ambient magic is no cause for panic, nor is it an invitation for bureaucratic overreach. The staff are fully capable of handling a few enthusiastic books.'",
            "Parents are advised to monitor correspondence from their owls. Meanwhile, the Daily Prophet will continue to keep its readers updated as this magical saga unfolds. Rumors that the anomalies were caused by a miscast potion in Professor Snape's dungeon remain unconfirmed at this hour."
        ],
        image: "assets/hogwarts_sketch.png",
        filter: "sepia-filter"
    },
    {
        id: "floo-rates",
        title: "MINISTRY REGULATES FLOO NETWORK RATES DUE TO PIXIE INFESTATION",
        subtitle: "Commuters Outraged as Travel Tariffs Spike; Department of Magical Transportation Blames Cornish Pests",
        author: "Percy Weasley, Junior Assistant to the Minister",
        date: "Thursday, 2 July 2026",
        category: "Ministry News",
        snippet: "A sudden infestation of Cornish Pixies in the main Floo fireplace hub has caused severe network delays. In response, the Ministry has announced temporary travel surcharge regulations.",
        content: [
            "Magical commuters faced major delays this morning as the Floo Network Connection Hub experienced a complete shutdown. Investigations revealed that a swarm of Cornish Pixies had nested in the primary flue dampers of the Ministry of Magic's guest fireplaces, causing travelers to be redirected to random chimneys across London.",
            "The Department of Magical Transportation has declared a level-two containment alert. In a controversial move, they have also announced a temporary 3-Sickle surcharge per connection to cover the cost of pest extraction teams.",
            "Commuter Amos Diggory commented, 'It is absolute rubbish! I ended up in a Muggle hardware shop in Croydon instead of my office. Now they want me to pay extra for the privilege of being covered in soot?'",
            "Pest control officers expect the network to be fully cleared by Friday, though travelers are urged to use broomsticks or Apparition where possible."
        ],
        image: null,
        filter: ""
    },
    {
        id: "lockhart-book",
        title: "GILDEROY LOCKHART ANNOUNCES NEW BLANK AUTOBIOGRAPHY 'WHO AM I?'",
        subtitle: "Five-Time Witch Weekly Most-Charming-Smile Winner Signs Deal from St. Mungo's Hospital",
        author: "Barnaby Gudgeon, Literary Critic",
        date: "Thursday, 2 July 2026",
        category: "Entertainment",
        snippet: "The amnesiac former Hogwarts professor and celebrated author Gilderoy Lockhart has signed a publishing deal for his new book, which is entirely blank.",
        content: [
            "Literary circles are abuzz with the news that former Hogwarts Defense Against the Dark Arts Professor Gilderoy Lockhart is releasing a new book. Lockhart, who is currently undergoing long-term memory therapy at St. Mungo's Hospital for Magical Maladies and Injuries, signed the contract using a golden quill.",
            "The book, titled 'Who Am I?', is reportedly 300 pages of completely blank parchment. According to his publisher, 'It represents Gilderoy's profound search for his own identity. It is a masterpiece of minimalist wizarding literature.'",
            "Lockhart himself was quoted as saying, 'I am very handsome, and I wrote this book! Or did someone else write it? I forget. But look at the smile on the back cover!'",
            "Pre-orders are already breaking records in Diagon Alley, with Flourish and Blotts stocking up on parchment wax to seal copies."
        ],
        image: null,
        filter: ""
    },
    {
        id: "london-thestral",
        title: "RUNAWAY THESTRAL CAUSES PANIC IN WEST LONDON MUGGLE STREETS",
        subtitle: "Department for the Regulation and Control of Magical Creatures Dispatches Obliviators",
        author: "Arthur Weasley, Misuse of Muggle Artifacts Office",
        date: "Thursday, 2 July 2026",
        category: "Local News",
        snippet: "A runaway Thestral from a local carriage company escaped into Muggle London. Obliviators were immediately deployed to modify the memories of confused Muggles.",
        content: [
            "A wild Thestral caused traffic chaos in Muggle West London yesterday afternoon. The winged creature, invisible to the majority of the Muggle population, was reported as a 'flying skeletal horse' by several confused pedestrians near Hyde Park.",
            "The Accidental Magic Reversal Squad and the Committee for Muggle-Worthy Excuses were dispatched instantly. Over forty Muggles had their memories modified, with official explanations attributing the sightings to a rogue hot-air balloon shaped like a dinosaur.",
            "Ministry spokesperson Arthur Weasley reminded the public: 'All domesticated magical beasts must be secured with proper disillusionment charms. We cannot have invisible stallions roaming Muggle parks.'"
        ],
        image: "assets/wizard_portrait.png",
        filter: "grayscale-filter"
    },
    {
        id: "quidditch-tickets",
        title: "QUIDDITCH WORLD CUP TICKETS SOLD OUT IN RECORD THREE MINUTES",
        subtitle: "Goblin Scalpers Accused of Cornering the Market; Tickets Listed for 50 Galleons on Black Market",
        author: "Ludo Bagman, Head of Magical Games and Sports",
        date: "Thursday, 2 July 2026",
        category: "Sports",
        snippet: "All tickets for the upcoming Quidditch World Cup were sold out almost instantly. Fans suspect goblin scalpers used speed-charms to buy out the inventory.",
        content: [
            "Fury has erupted among Quidditch fans as all tickets for the upcoming World Cup final sold out within three minutes of the booking owls being released.",
            "Dozens of fans reported that their booking letters were intercepted, while others claimed the Gringotts ordering system crashed under the weight of thousands of simultaneous Galleon transfers. Hours later, tickets appeared on the black market in Knockturn Alley for upwards of 50 Galleons each.",
            "Rumors suggest a cartel of rogue goblins used illegal speed-charms on their booking owls to bypass the standard queues. Gringotts Bank has vehemently denied any involvement of its employees, stating that security measures are impenetrable."
        ],
        image: null,
        filter: ""
    },
    {
        id: "dragon-flight",
        title: "DRAGON FLIGHT PATHS ALTERED NEAR SNOWDONIA FOR MUGGLE SAFETY",
        subtitle: "Common Welsh Greens Directed Away from Popular Hiking Routes After Close Encounter",
        author: "Charlie Weasley, Dragon Sanctuary Warden",
        date: "Thursday, 2 July 2026",
        category: "World News",
        snippet: "The flight corridor for Welsh Green dragons has been shifted to avoid hiking trails in Wales. The Ministry intervened after hikers reported heat waves.",
        content: [
            "The Ministry of Magic has redrawn the boundaries of the dragon flight corridor over Snowdonia, Wales. This follows an incident last weekend where a group of Muggle hikers experienced sudden, unexplained heat waves and smell of sulfur, which was later identified as a Common Welsh Green flying too low.",
            "Dragon wardens from the Romanian Sanctuary were called in to help herd the local nesting pairs further north into the uninhabited valleys.",
            "Charlie Weasley, speaking from Wales, said: 'The Welsh Green is generally peaceful unless provoked, but they like to sunbathe on the high ridges. Moving their flight paths will keep both the dragons and the Muggles safe.'"
        ],
        image: null,
        filter: ""
    },
    {
        id: "black-forest-aurors",
        title: "MYSTERIOUS DARK GATHERINGS SPOTTED IN THE BLACK FOREST; AURORS SENT",
        subtitle: "Local Centaurs Warn of Shadowy Figures Performing Midnight Rites",
        author: "Kingsley Shacklebolt, Senior Auror",
        date: "Thursday, 2 July 2026",
        category: "Security",
        snippet: "A team of elite Aurors has been dispatched to the Black Forest in Germany. Centaur tribes reported shadowy figures gathering during the new moon.",
        content: [
            "The Ministry of Magic, in coordination with the German Ministry of Magic, has authorized a secret scouting mission into the depths of the Black Forest.",
            "Centaur tribes, who guard the outer boundaries of the forest, reported seeing groups of hooded wizards carrying ancient silver lanterns. According to the centaurs, these individuals were chanting in a forgotten dialect and performing rites around ancient stone circles.",
            "Senior Auror Kingsley Shacklebolt urged vigilance: 'We do not know their intentions, but any unregistered dark magic gatherings will be dealt with swiftly. We advise all potion brewers to avoid importing ingredients from the Black Forest until further notice.'"
        ],
        image: null,
        filter: ""
    },
    {
        id: "sleekeazy-shortage",
        title: "SLEEKEAZY'S HAIR POTION SALES SKYROCKET; NATIONWIDE SHORTAGE REPORTED",
        subtitle: "Diagon Alley Apothecaries Limit Purchases Ahead of the Annual Hogwarts Yule Ball",
        author: "Celestina Warbeck, Society Columnist",
        date: "Thursday, 2 July 2026",
        category: "Economy",
        snippet: "A massive shortage of Sleekeazy's Hair Potion has hit the shops. Apothecaries have limited purchases to one bottle per customer.",
        content: [
            "Disaster has struck fashion-conscious witches and wizards across the country. Shops in Diagon Alley and Hogsmeade have reported that shelves have been completely emptied of Sleekeazy's Hair Potion & Scalp Cleanser.",
            "The shortage is blamed on a sudden rush of purchases ahead of the upcoming Hogwarts ball, combined with an accident at the manufacturing plant in Northern England where a cauldron of potion exploded, coating the entire village in ultra-shiny, slicked-back grass.",
            "Apothecary owner Mr. Mulpepper stated: 'We have had to limit sales to one bottle per customer. People are offering triple the price! Witches are panic-buying whatever bottles are left.'"
        ],
        image: "assets/potion_sketch.png",
        filter: "potion-photo"
    },
    {
        id: "niffler-gringotts",
        title: "REPORT OF ESCAPED NIFFLERS IN LOWER VAULTS OF GRINGOTTS BANK",
        subtitle: "Goblin Guards Insist Vault Security Remains 100% Impenetrable",
        author: "Griphook, Gringotts Public Relations",
        date: "Thursday, 2 July 2026",
        category: "Gossip",
        snippet: "Rumors are spreading that a family of Nifflers escaped into the lower Gringotts vaults, attracted by high-security gold piles.",
        content: [
            "Whispers from within the cobblestone corridors of Diagon Alley suggest that Gringotts wizarding bank has a furry problem in its lower vaults.",
            "According to anonymous sources, a breeding pair of Nifflers escaped from a traveling magical beast merchant and burrowed their way into the high-security vaults. Goblins have allegedly spent the last three days chasing the creatures through the gold-lined caverns, though they deny any coins have gone missing.",
            "Gringotts spokesperson Griphook issued a brief statement: 'Gringotts vaults are protected by ancient spells, dragons, and enchantments. A Niffler cannot bypass our security. The vaults are completely secure. Any rumors to the contrary are slanderous.'"
        ],
        image: null,
        filter: ""
    },
    {
        id: "egyptian-orb",
        title: "DEPARTMENT OF MYSTERIES ACQUIRES GLOWING EGYPTIAN ORB",
        subtitle: "Unspeakables Refuse to Disclose the Purpose of the Ancient Artifact",
        author: "Broderick Bode, Unspeakable",
        date: "Thursday, 2 July 2026",
        category: "Mystery",
        snippet: "An ancient glowing orb, recovered from a tomb in Giza, has been delivered to the Ministry. Officials refuse to release details regarding its properties.",
        content: [
            "A highly classified containment crate was delivered to the Ministry of Magic under heavy guard last night. The crate contains an ancient, glowing stone orb discovered during excavations of a wizarding pharaoh's tomb in Egypt.",
            "Whispers suggest the orb pulses with a warm blue light and hums at a pitch that causes nearby metallic items to hover. Unspeakables from the Department of Mysteries took possession of the artifact immediately.",
            "When pressed for comments, Ministry representatives stated: 'The artifact is under routine study. There is absolutely no danger to the public, and no further details will be disclosed at this time.' Our reporters advise staying clear of the level-nine corridors."
        ],
        image: null,
        filter: ""
    }
];

// Export for node or keep as global variable for simple static site
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = articlesData;
}
