import { evidenceItems } from "./evidence";
import { sources } from "./sources";
import type {
  CanonEntry,
  ComparisonCohort,
  ComparisonCohortKey,
  ComparisonDimension,
  ComparisonEvidenceStatus,
  ComparisonOption,
  GenerationKey,
} from "./types";

export type {
  CanonEntry,
  ComparisonClass,
  ComparisonCohort,
  ComparisonCohortKey,
  ComparisonDimension,
  ComparisonEvidenceStatus,
  ComparisonOption,
  ComparisonTopicKind,
  GenerationKey,
} from "./types";

export type ComparisonEvidenceRecord = {
  id: string;
  sourceId: string;
  insightIds: string[];
  claim: string;
  locator: string;
  support: string;
  sourceTitle: string;
  sourceOrganization: string;
  sourceUrl: string;
};

export const generations: Array<{
  id: GenerationKey;
  label: string;
  years: string;
  agesIn2026: string;
}> = [
  { id: "boomers", label: "Boomers", years: "1946–1964", agesIn2026: "62–80" },
  { id: "genX", label: "Gen X", years: "1965–1980", agesIn2026: "46–61" },
  { id: "millennials", label: "Millennials", years: "1981–1996", agesIn2026: "30–45" },
  { id: "genZ", label: "Gen Z", years: "1997–2010", agesIn2026: "16–29" },
  { id: "genAlpha", label: "Gen Alpha", years: "2010–2024", agesIn2026: "1–16" },
];

export const comparisonCohorts: Array<{ id: ComparisonCohortKey; label: string }> = generations
  .filter((generation) => generation.id !== "genAlpha")
  .map((generation) => ({ id: generation.id as ComparisonCohortKey, label: generation.label }));

export const defaultSelectedGenerations: GenerationKey[] = ["genZ", "genAlpha"];

export const generationRank: Record<GenerationKey, number> = {
  boomers: 0,
  genX: 1,
  millennials: 2,
  genZ: 3,
  genAlpha: 4,
};

const sourceById = new Map(sources.map((source) => [source.id, source]));
const evidenceById = new Map(evidenceItems.map((item) => [item.id, item]));

const entry = (id: string, year: number, label: string, note: string): CanonEntry => ({
  id,
  year,
  label,
  note,
});

const canonSupport = (who: string, angle: string) =>
  `Places ${who} on the Lab’s editorial canon board: ${angle} Documented events and widely reported properties, not a ranked survey.`;

const hypothesis = (
  mentality: string,
  entries: CanonEntry[],
  support: string,
  ageRange: string,
): ComparisonCohort => ({
  mentality,
  ageRange,
  geography: "Primarily United States cultural frame, with global properties where they actually traveled",
  sourceYear: "2026 editorial board",
  evidenceStatus: "editorial hypothesis",
  sourceIds: ["lab-generation-canon-2026"],
  evidenceIds: ["evidence-compare-canon-1"],
  evidenceSupport: { "evidence-compare-canon-1": support },
  entries,
});

const measured = (
  mentality: string,
  ageRange: string,
  geography: string,
  sourceYear: string,
  evidenceStatus: ComparisonEvidenceStatus,
  sourceIds: string[],
  evidenceIds: string[],
  evidenceSupport: Record<string, string>,
  entries: CanonEntry[] = [],
): ComparisonCohort => ({
  mentality,
  ageRange,
  geography,
  sourceYear,
  evidenceStatus,
  sourceIds,
  evidenceIds,
  evidenceSupport,
  entries,
});

const option = (
  cohort: ComparisonCohort,
  realDifference: string,
  everydayExample: string,
  caveat: string,
  comparisonClass: ComparisonOption["comparisonClass"] = "cultural canon",
): ComparisonOption => ({ comparisonClass, cohort, realDifference, everydayExample, caveat });

const caveatCanon =
  "This is a cultural-weather board, not a Nielsen chart. A title can matter to more than one generation. Overlaps are the point, not a mistake.";

const years = {
  boomers: "Coming of age roughly 1964–1984",
  genX: "Coming of age roughly 1983–1998",
  millennials: "Coming of age roughly 1999–2014",
  genZ: "Coming of age roughly 2013–2028",
  genAlpha: "Childhood 2010–2024; oldest edge now in mid-teens",
};

export const comparisonDimensions: ComparisonDimension[] = [
  {
    id: "formative-moments",
    title: "Formative moments",
    kind: "moments",
    prompt: "Ten moments that actually marked the timeline — not a greatest-hits list of world history.",
    method: "Editorial hypotheses, contextual to each generation. Overlaps are expected. Divergences are the story.",
    genAlpha: hypothesis(
      "Their memory starts in a phone-and-platform world. The shocks are school closing, feeds that never skip, and tools that talk back.",
      [
        entry("ipad", 2010, "iPad arrives", "The cohort’s birth year is also the tablet year. Screens are furniture, not a later upgrade."),
        entry("youtube-kids", 2015, "YouTube as native TV", "Unboxing, playthroughs, and kid YouTube replace a shared Saturday-morning block."),
        entry("fortnite", 2017, "Fortnite becomes a hangout", "A game, a concert venue, and a schoolyard language at once."),
        entry("covid", 2020, "COVID school", "Kindergarten through fifth grade happened on mute, then in masks. That is a childhood, not a news cycle."),
        entry("george-floyd", 2020, "George Floyd protests", "Older Alpha met a national reckoning as children watching adults argue on the same screens they play on."),
        entry("roblox", 2021, "Roblox as the clubhouse", "The hangout is a platform you build inside, not a show you finish."),
        entry("chatgpt", 2022, "ChatGPT while still in school", "A fluent answer machine shows up before citation habits are formed."),
        entry("election-2024", 2024, "2024 U.S. election as kids", "They did not vote. They still absorbed the memes, the fear, and the jokes."),
        entry("kpop-global", 2025, "K-pop / Demon Hunters wave", "Youth culture they actually meet is already global, musical, and clip-native."),
        entry("absurdist-humor", 2025, "6-7 and absurdist in-jokes", "The joke is the reference. If you have to ask, it was not for you."),
      ],
      canonSupport("Gen Alpha", "childhood platform shocks and school-era AI, not adult news memory."),
      years.genAlpha,
    ),
    comparisons: {
      genZ: option(
        hypothesis(
          "They were children for 9/11’s aftermath, teens for the smartphone, and young adults for COVID, 2020, and ChatGPT.",
          [
            entry("september-11", 2001, "September 11", "Oldest Z were small children. The image set the background weather for a childhood."),
            entry("iphone", 2007, "The iPhone", "A pocket internet arrived while they were still in school, not after they had jobs."),
            entry("obama", 2008, "Obama presidency", "For a lot of Z, this is the first presidency they can actually remember."),
            entry("election-2016", 2016, "2016 election", "Adolescence plus a permanent-comment-section politics."),
            entry("parkland", 2018, "Parkland / March for Our Lives", "School safety stopped being an adult policy topic and became their walkout."),
            entry("covid", 2020, "COVID-19", "Prom, graduation, first jobs, and friendship all went through a screen."),
            entry("george-floyd", 2020, "George Floyd / 2020", "Protest, livestream, and argument as a teenage civic education."),
            entry("tiktok", 2020, "TikTok as default feed", "Sound, face, and remix become the native way culture moves."),
            entry("chatgpt", 2022, "ChatGPT", "Schoolwork, search, and “what counts as cheating” change in the same semester."),
            entry("luigi", 2024, "Luigi Mangione as a flashpoint", "Not the biggest event in American history — a culturally loud collision of class rage, meme, and news."),
          ],
          canonSupport("Gen Z", "the smartphone-to-COVID arc, plus later flashpoints like ChatGPT and Luigi."),
          years.genZ,
        ),
        "Z carries 9/11, the iPhone, and 2016 as memory. Alpha meets COVID, Roblox, and ChatGPT as the furniture of childhood — same years, different age.",
        "A 16-year-old can tell you where they were when school went remote. A 6-year-old just knows that home and school blurred.",
        caveatCanon,
      ),
      millennials: option(
        hypothesis(
          "Their coming-of-age runs through 9/11, the iPhone, the financial crisis, and Obama — then they parent Alpha through COVID.",
          [
            entry("columbine", 1999, "Columbine", "The school-shooting template enters teenage life as news, then as drill."),
            entry("september-11", 2001, "September 11", "The defining public trauma of the millennial young-adult window."),
            entry("iraq-war", 2003, "Iraq / Afghanistan years", "A long war on television while they entered college and work."),
            entry("facebook", 2004, "Facebook / social web", "Profiles, status, and later feeds become the social operating system they built."),
            entry("iphone", 2007, "The iPhone", "Adulthood and the smartphone arrive together."),
            entry("financial-crisis", 2008, "Financial crisis", "First jobs, first apartments, and a recession in the same season."),
            entry("obama", 2008, "Obama election", "A political coming-of-age that a lot of millennials still use as a timestamp."),
            entry("election-2016", 2016, "2016 election", "The feed they helped invent turns on them as adults."),
            entry("covid", 2020, "COVID as working adults", "Work-from-home, childcare, and the kids’ remote school at the same kitchen table."),
            entry("chatgpt", 2022, "ChatGPT at work", "They meet the tool as employees and parents, not as 12-year-olds."),
          ],
          canonSupport("Millennials", "9/11 through Obama and the crash, then parenting through COVID and AI."),
          years.millennials,
        ),
        "Millennials remember 9/11 as young people. Alpha will remember COVID school. The iPhone is a millennial launch and an Alpha default.",
        "The parent who got an iPhone in college is raising a child who never saw a home without a tablet.",
        caveatCanon,
      ),
      genX: option(
        hypothesis(
          "Cable news, MTV, the end of the Cold War, and Columbine sit in the middle of their growing up.",
          [
            entry("watergate", 1974, "Nixon resigns", "Politics on TV as a childhood weather system."),
            entry("mtv", 1981, "MTV launches", "Music becomes image, 24 hours a day."),
            entry("challenger", 1986, "Challenger", "A classroom TV moment a lot of X still locates in the body."),
            entry("aids", 1981, "AIDS crisis", "Sex, fear, and public silence as a teenage education."),
            entry("berlin-wall", 1989, "Berlin Wall falls", "The Cold War ends while they are in school or first jobs."),
            entry("gulf-war", 1991, "Gulf War on CNN", "War as a live cable event."),
            entry("nevermind", 1991, "Nevermind / grunge", "A youth soundtrack that felt like a refusal of the 80s shine."),
            entry("internet-home", 1995, "Home internet / AOL", "The web arrives as a noisy, dial-up, after-school place."),
            entry("columbine", 1999, "Columbine", "The shooting that rewired how American schools talk about danger."),
            entry("y2k", 2000, "Y2K", "A technological anxiety that now reads as analog."),
          ],
          canonSupport("Gen X", "MTV-to-Columbine years, with the end of the Cold War in the middle."),
          years.genX,
        ),
        "X watched history on one shared TV. Alpha meets history already cut into clips, games, and group chats.",
        "The Challenger broadcast is a single room. COVID school is a thousand muted tiles.",
        caveatCanon,
      ),
      boomers: option(
        hypothesis(
          "Network television, civil rights, Vietnam, and Watergate are the public plot of their youth.",
          [
            entry("jfk", 1963, "JFK assassination", "A death the country watched together, then replayed."),
            entry("civil-rights", 1964, "Civil Rights years", "Law, protest, and televised confrontation as civic education."),
            entry("mlk", 1968, "MLK / 1968", "A year that stacked assassinations, war, and riot coverage."),
            entry("moon-landing", 1969, "Moon landing", "A shared technological miracle on one or two channels."),
            entry("vietnam", 1968, "Vietnam & the draft", "War that could claim you, not only occupy the news."),
            entry("woodstock", 1969, "Woodstock", "Youth culture as a mass gathering, then a recording."),
            entry("watergate", 1974, "Watergate", "Trust in institutions as a primetime serial."),
            entry("oil-crisis", 1973, "Oil crisis", "Scarcity and inflation as a household lesson."),
            entry("mtv", 1981, "MTV (younger boomers)", "Image-led music arrives as they enter adulthood."),
            entry("berlin-wall", 1989, "Berlin Wall (as adults)", "The Cold War’s end as a midlife public event."),
          ],
          canonSupport("Boomers", "televised public history from JFK through Watergate, with later adult shocks."),
          years.boomers,
        ),
        "Boomer formative memory is a shared broadcast. Alpha formative memory is a platform they already lived inside.",
        "One country watched the moon landing. Alpha watched school reopen in pieces, through whatever app the household had.",
        caveatCanon,
      ),
    },
    pairReads: {
      boomers__genX: "Boomers got the moon landing and Vietnam; X got MTV, Challenger, and the Wall coming down. Same century, different set of living-room shocks.",
      boomers__millennials: "Boomers’ public plot is JFK-to-Watergate. Millennials’ is 9/11-to-Obama. Both are news generations — the set just changed.",
      boomers__genZ: "Boomers remember a draft. Z remembers a feed. The distance is not taste. It is how the event arrived.",
      genX__millennials: "X got cable and Columbine. Millennials got 9/11 and the iPhone. The internet is a teenage place for one and an adult tool for the other.",
      genX__genZ: "X watched Challenger in class. Z watched COVID close the class. School as the site of the shock is the overlap.",
      millennials__genZ: "9/11, the iPhone, Obama, 2016, COVID, ChatGPT — the list overlaps. The age at which each one hit does not.",
    },
  },
  {
    id: "tv-shows",
    title: "Biggest shows",
    kind: "culture",
    prompt: "What counted as “the show” — a network appointment, a DVD season, a reality franchise, or a YouTube slot.",
    method: "Editorial canon of widely reported landmarks, not a ratings table. Kid YouTube counts as television for Alpha.",
    genAlpha: hypothesis(
      "A “show” is often a creator, a game stream, or a preschool world that loops. Appointment TV is the exception.",
      [
        entry("bluey", 2018, "Bluey", "The family show that actually holds kids and parents without talking down."),
        entry("cocomelon", 2018, "CoComelon / preschool YouTube", "For the youngest edge, this is closer to TV than primetime ever was."),
        entry("minecraft-yt", 2019, "Minecraft / Roblox on YouTube", "Watching someone else play is the sitcom."),
        entry("mrbeast", 2021, "MrBeast-scale YouTube", "Stunts and thumbnails as a shared text even when parents do not get it."),
        entry("love-island", 2022, "Love Island (older edge)", "Reality as a clip-and-group-chat sport, inherited from Z."),
      ],
      canonSupport("Gen Alpha", "creator video and preschool worlds as television, with Love Island only on the older edge."),
      years.genAlpha,
    ),
    comparisons: {
      genZ: option(
        hypothesis(
          "Reality, streaming sagas, and YouTube sit in the same slot millennials reserved for Sunday-night drama.",
          [
            entry("love-island", 2015, "Love Island", "The water-cooler show that lives in clips, votes, and group chats."),
            entry("stranger-things", 2016, "Stranger Things", "A streaming event that still felt like a shared season."),
            entry("euphoria", 2019, "Euphoria", "Teen life as stylized, soundtracked, and argued-about."),
            entry("squid-game", 2021, "Squid Game", "A global drop that proved a non-English series could own the week."),
            entry("youtube-tv", 2018, "YouTube as TV", "The default channel is a person, not a network."),
          ],
          canonSupport("Gen Z", "Love Island through Squid Game, with YouTube already counting as television."),
          years.genZ,
        ),
        "Z’s landmark is Love Island and streaming events. Alpha’s landmark is often a YouTube slot or Bluey — the older edge then inherits Love Island.",
        "A millennial asks what you are watching. A child names a creator. An older Z names an island.",
        caveatCanon,
      ),
      millennials: option(
        hypothesis(
          "The serialized TV novel — Friends into The Office into Breaking Bad and Game of Thrones.",
          [
            entry("friends", 1994, "Friends", "The hangout comedy that later became comfort TV for the next two cohorts."),
            entry("the-office", 2005, "The Office", "Dummy-season, meme-season, comfort-season — still in the bloodstream."),
            entry("breaking-bad", 2008, "Breaking Bad", "The prestige climb as a weekly (then binge) event."),
            entry("game-of-thrones", 2011, "Game of Thrones", "The last truly mass water-cooler saga for a lot of millennial living rooms."),
            entry("house-of-the-dragon", 2022, "House of the Dragon", "The sequel era: same world, smaller shared event."),
          ],
          canonSupport("Millennials", "Friends through Breaking Bad and Game of Thrones as the serialized novel."),
          years.millennials,
        ),
        "Millennials got Breaking Bad and Thrones. Z got Love Island. The shift is from the closed saga to the ongoing clip.",
        "One cohort waited for Sunday. The next waits for the sound to hit TikTok.",
        caveatCanon,
      ),
      genX: option(
        hypothesis(
          "Must-see TV and the first reality experiments — Simpsons, Seinfeld, Friends, The Real World.",
          [
            entry("simpsons", 1989, "The Simpsons", "The cartoon that became the American reference machine."),
            entry("seinfeld", 1989, "Seinfeld", "Nothing as a format, still quoted."),
            entry("friends", 1994, "Friends", "Shared with millennials; X caught it live."),
            entry("xfiles", 1993, "The X-Files", "Friday-night paranoia as entertainment."),
            entry("real-world", 1992, "The Real World", "The seed of the reality machine Z later lives inside."),
          ],
          canonSupport("Gen X", "must-see comedy and the first MTV reality format."),
          years.genX,
        ),
        "X helped invent reality TV. Z lives in it. Alpha clips it.",
        "The Real World is a dorm on MTV. Love Island is the same dare with better lighting and a faster meme cycle.",
        caveatCanon,
      ),
      boomers: option(
        hypothesis(
          "Network appointment television: one or two channels, a shared night, a catchphrase the next morning.",
          [
            entry("lucy", 1951, "I Love Lucy", "The template for the living-room sitcom, then endless reruns."),
            entry("twilight-zone", 1959, "The Twilight Zone", "Genre TV as a moral machine."),
            entry("mash", 1972, "M*A*S*H", "Comedy and war in the same half-hour."),
            entry("all-in-the-family", 1971, "All in the Family", "The argument at the dinner table, broadcast."),
            entry("roots", 1977, "Roots", "A miniseries that stopped the country for a week."),
          ],
          canonSupport("Boomers", "network appointment TV from Lucy through Roots."),
          years.boomers,
        ),
        "Boomers had a shared night. Alpha has a shared clip. The difference is not attention span. It is how many rooms the show has to travel through.",
        "Roots stopped the country. A MrBeast drop stops a group chat.",
        caveatCanon,
      ),
    },
    pairReads: {
      boomers__genX: "Boomers got M*A*S*H. X got Simpsons and The Real World. Comedy stays; the laugh track leaves.",
      boomers__millennials: "One cohort had Roots. The next had Game of Thrones. Both were mass events. Only one needed HBO.",
      boomers__genZ: "Appointment network vs. Love Island clips. The water cooler moved into the phone.",
      genX__millennials: "X watched Friends live. Millennials finished The Office and Thrones. Sitcom to saga.",
      genX__genZ: "The Real World becomes Love Island. Reality is the through-line; the distribution is not.",
      millennials__genZ: "Breaking Bad vs. Love Island is the cleanest contrast: closed prestige vs. ongoing clip-native reality.",
    },
  },
  {
    id: "movies",
    title: "Movies",
    kind: "culture",
    prompt: "The films that worked as a generation’s shared dark room — theaters, DVD shelves, then opening-weekend clips.",
    method: "Editorial landmarks. Box office helps, but a childhood rewatch can matter more than a #1 weekend.",
    genAlpha: hypothesis(
      "Animation, video-game adaptations, and theatrical events they attend with adults. The clip still arrives first.",
      [
        entry("frozen", 2013, "Frozen", "A preschool-to-tween soundtrack that would not leave the house."),
        entry("moana", 2016, "Moana", "Another Disney world kids actually replay, sing, and wear."),
        entry("mario-movie", 2023, "The Super Mario Bros. Movie", "A game they already lived in, on a screen they sit in together."),
        entry("inside-out-2", 2024, "Inside Out 2", "Feelings as IP, and a genuine kid-adult crossover."),
        entry("minecraft-movie", 2025, "A Minecraft Movie", "The hangout platform as a theatrical night."),
      ],
      canonSupport("Gen Alpha", "Disney animation and game-world films as the theatrical childhood."),
      years.genAlpha,
    ),
    comparisons: {
      genZ: option(
        hypothesis(
          "Disney-to-Marvel as default, then Spider-Verse and Barbie as the self-aware event.",
          [
            entry("frozen", 2013, "Frozen", "Shared with Alpha’s older edge; Z met it in school."),
            entry("marvel-peak", 2019, "Marvel peak / Endgame", "The theatrical event as a decade-long homework assignment."),
            entry("spider-verse", 2018, "Spider-Verse", "Style as the movie. Kids and teens both claimed it."),
            entry("barbie", 2023, "Barbie", "A meme, a night out, and a cultural argument in pink."),
            entry("everything-everywhere", 2022, "Everything Everywhere All at Once", "The art-house hit that still leaked into youth style."),
          ],
          canonSupport("Gen Z", "Marvel-to-Barbie event movies, with Frozen overlapping Alpha."),
          years.genZ,
        ),
        "Z had Marvel as a decade. Alpha has Mario and Minecraft as movies of worlds they already play in.",
        "One cohort dressed for Endgame. The next recites Mario like a folk song.",
        caveatCanon,
      ),
      millennials: option(
        hypothesis(
          "Titanic, Potter, Jackson’s Middle-earth, then the Dark Knight — movies as a teenage religion.",
          [
            entry("titanic", 1997, "Titanic", "The last analog mega-event a lot of millennials still date by."),
            entry("harry-potter", 2001, "Harry Potter films", "A childhood-to-college franchise with midnight lines."),
            entry("lotr", 2001, "The Lord of the Rings", "The other saga you were supposed to have an opinion about."),
            entry("dark-knight", 2008, "The Dark Knight", "The serious comic-book movie, before the universe ate the calendar."),
            entry("avatar", 2009, "Avatar", "Spectacle as the reason to leave the house."),
          ],
          canonSupport("Millennials", "Titanic through Potter, LOTR, and The Dark Knight."),
          years.millennials,
        ),
        "Millennials stood in line for Potter. Alpha sits down for Mario. Fandom moved from midnight premieres to already-knowing the world.",
        "A sorting hat vs. a character select screen.",
        caveatCanon,
      ),
      genX: option(
        hypothesis(
          "Spielberg-Lucas childhoods, then VHS as a private theater.",
          [
            entry("et", 1982, "E.T.", "The suburban wonder movie."),
            entry("back-to-the-future", 1985, "Back to the Future", "Time travel as a teenage joke about their parents’ world."),
            entry("gremlins", 1984, "Gremlins", "The other kind of family film — meaner, quotable."),
            entry("jurassic-park", 1993, "Jurassic Park", "Digital spectacle arriving while they were in high school or first jobs."),
            entry("titanic", 1997, "Titanic", "Shared with millennials; X saw it as adults."),
          ],
          canonSupport("Gen X", "E.T. through Jurassic Park, with VHS as the private theater."),
          years.genX,
        ),
        "X got dinosaurs in the cinema. Alpha gets the game they already play, projected. Spectacle vs. recognition.",
        "Jurassic Park showed you a thing you had never seen. A Minecraft movie shows you a thing you already build.",
        caveatCanon,
      ),
      boomers: option(
        hypothesis(
          "The first blockbuster era: Jaws, Star Wars, and the movie as a summer event.",
          [
            entry("sound-of-music", 1965, "The Sound of Music", "The family epic you were taken to, then sang."),
            entry("jaws", 1975, "Jaws", "The invention of the summer movie as a dare."),
            entry("star-wars", 1977, "Star Wars", "A mythology that every later cohort still inherits."),
            entry("grease", 1978, "Grease", "Nostalgia about an earlier youth, already looping."),
            entry("et", 1982, "E.T. (younger boomers as parents)", "The family film they took kids to — overlap with X childhood."),
          ],
          canonSupport("Boomers", "Jaws and Star Wars as the first blockbuster era."),
          years.boomers,
        ),
        "Boomers got the first Star Wars. Alpha gets the same galaxy as merchandise, game, and clip — plus Mario.",
        "The original Star Wars was a new language. For Alpha it is already a dialect their parents speak.",
        caveatCanon,
      ),
    },
    pairReads: {
      boomers__genX: "Jaws invents the summer. E.T. inherits it. Both still require a dark room.",
      boomers__millennials: "Star Wars as revelation vs. Potter as homework. Myth vs. curriculum.",
      boomers__genZ: "One night at Star Wars vs. a decade of Marvel. The serial ate the event.",
      genX__millennials: "VHS childhood vs. midnight Potter lines. Ownership of the disc vs. ownership of the night.",
      genX__genZ: "E.T. is wonder from outside. Frozen is a soundtrack you cannot escape. Both are family films with different jobs.",
      millennials__genZ: "Potter midnight lines vs. Endgame homework. Franchise as childhood, then as extra credit.",
    },
  },
  {
    id: "music",
    title: "Music",
    kind: "culture",
    prompt: "How a generation found songs: radio, MTV, iTunes, then a sound on a clip.",
    method: "Editorial canon of artists and discovery systems. Not a Billboard ranking for children.",
    genAlpha: hypothesis(
      "Songs arrive as sounds, schoolyard chants, game emotes, and Disney worlds — often before an album has a name.",
      [
        entry("disney-sound", 2013, "Frozen / Encanto songs", "The household soundtrack is a movie they can replay."),
        entry("taylor-swift", 2023, "Taylor Swift (crossover)", "A millennial/Z artist who still leaks into kid fandom and playgrounds."),
        entry("kpop", 2024, "K-pop as default pop", "Choreography, clips, and fandom as the way a song travels."),
        entry("sped-up", 2023, "Sped-up / sound-led hits", "The clip is the radio. The artist can come later."),
        entry("kid-youtube-music", 2018, "Kid YouTube + game music", "Roblox, Minecraft, and nursery loops share the same speaker."),
      ],
      canonSupport("Gen Alpha", "sound-led and world-led music: Disney, K-pop, clips, and game audio."),
      years.genAlpha,
    ),
    comparisons: {
      genZ: option(
        hypothesis(
          "Streaming plus TikTok. Drake to Billie to Olivia — and whatever sound is moving this week.",
          [
            entry("drake", 2016, "Drake", "The ambient pop-rap of a Z adolescence."),
            entry("billie", 2019, "Billie Eilish", "Bedroom pop as a global teenage voice."),
            entry("olivia", 2021, "Olivia Rodrigo", "Heartbreak as a school-year event."),
            entry("tiktok-music", 2020, "TikTok as radio", "A song can be famous as a sound before it is famous as a song."),
            entry("kpop", 2020, "K-pop / BTS into the next wave", "Fandom as homework, dance as participation."),
          ],
          canonSupport("Gen Z", "streaming-and-TikTok artists, from Drake and Billie to sound-led hits."),
          years.genZ,
        ),
        "Z still has artists with names. Alpha often has a sound, a Disney world, or a K-pop clip first. Taylor is the bridge.",
        "Someone asks for the song. The child hums the sped-up version from a video.",
        caveatCanon,
      ),
      millennials: option(
        hypothesis(
          "Napster to iTunes to streaming. Eminem, Beyoncé, and the mp3 as a bedroom archive.",
          [
            entry("eminem", 2002, "Eminem", "The suburban rap argument of a millennial teenage year."),
            entry("beyonce", 2003, "Beyoncé", "Pop craft as a career they watched in public."),
            entry("itunes", 2003, "iTunes / iPod", "Owning 1,000 songs in a pocket before the cloud."),
            entry("napster", 1999, "Napster / file-sharing", "The first version of “everything, immediately,” with a worse UI."),
            entry("swift-early", 2008, "Early Taylor Swift", "Country-pop that later becomes the crossover Alpha still meets."),
          ],
          canonSupport("Millennials", "mp3 ownership and the Eminem-to-Beyoncé radio."),
          years.millennials,
        ),
        "Millennials collected files. Alpha collects sounds. The artist can be the same person — Swift — at a different point in the pipeline.",
        "An iPod on shuffle vs. a Roblox emote that is also a song.",
        caveatCanon,
      ),
      genX: option(
        hypothesis(
          "MTV, mixtapes, and the album as an object. Madonna, Michael, Nirvana, early hip-hop.",
          [
            entry("madonna", 1984, "Madonna", "Image, controversy, and the video as the song."),
            entry("jackson", 1982, "Michael Jackson", "The crossover that still sits under later pop."),
            entry("nirvana", 1991, "Nirvana", "The refusal record."),
            entry("hiphop-golden", 1988, "Hip-hop’s public breakthrough", "Public Enemy to N.W.A. as a second national radio."),
            entry("mtv", 1981, "MTV as discovery", "You saw the song, then bought it."),
          ],
          canonSupport("Gen X", "MTV discovery and the Madonna-Jackson-Nirvana stack."),
          years.genX,
        ),
        "X saw the song on MTV. Alpha hears it as a sound attached to a face, a game, or a dance. Video stays; the channel does not.",
        "A Saturday-night countdown vs. an infinite For You page.",
        caveatCanon,
      ),
      boomers: option(
        hypothesis(
          "Radio, records, and the Beatles-to-Motown stack. The song as a shared public object.",
          [
            entry("beatles", 1964, "The Beatles", "The template for youth fandom as a public event."),
            entry("motown", 1965, "Motown", "A label as a radio format and a civil-rights-era soundtrack."),
            entry("woodstock-music", 1969, "Festival years", "Music as a gathering you had to travel to."),
            entry("fleetwood", 1977, "Fleetwood Mac / stadium rock", "The album you actually wore out."),
            entry("disco", 1977, "Disco / Saturday Night Fever", "A dance floor that later became a punchline, then a sample."),
          ],
          canonSupport("Boomers", "radio and records, Beatles through Motown and stadium albums."),
          years.boomers,
        ),
        "Boomers waited for the radio. Alpha’s radio is whatever clip is already moving. Both still sing in groups. The group just changed rooms.",
        "A Beatles arrival on a variety show vs. a K-pop dance in a cafeteria.",
        caveatCanon,
      ),
    },
    pairReads: {
      boomers__genX: "Radio and records vs. MTV. The song gets a face.",
      boomers__millennials: "The Beatles on a variety show vs. Eminem on an iPod. Public event vs. private archive.",
      boomers__genZ: "A shared radio vs. a personal sound. Scale inverted.",
      genX__millennials: "The album object vs. the mp3 library. Both still named the artist first.",
      genX__genZ: "MTV countdown vs. TikTok sound. Video discovery, two generations apart.",
      millennials__genZ: "iTunes libraries vs. TikTok sounds. Ownership vs. velocity.",
    },
  },
  {
    id: "public-events",
    title: "Public events",
    kind: "culture",
    prompt: "The news that actually entered the coming-of-age years — politics, violence, pandemics, institutions.",
    method: "A tighter political/news board than formative moments. Overlaps with that list are deliberate.",
    genAlpha: hypothesis(
      "They did not vote. They still lived through closed schools, a racial-justice year, an always-on climate story, and an election in the house.",
      [
        entry("covid", 2020, "COVID school closures", "The public event that rearranged the day."),
        entry("george-floyd", 2020, "George Floyd year", "Protest as something on the same device as the game."),
        entry("jan6", 2021, "January 6 (as young children)", "A Capitol riot as background TV they were not supposed to understand."),
        entry("ukraine", 2022, "Ukraine war", "A European war as a thumbnail and a fundraiser, not a draft."),
        entry("election-2024", 2024, "2024 election", "Household tension, classroom rules, and memes without a ballot."),
        entry("climate", 2018, "Climate as always-on", "Not a single day — the future already framed as a countdown."),
      ],
      canonSupport("Gen Alpha", "COVID school, 2020, and a childhood election — news without a ballot."),
      years.genAlpha,
    ),
    comparisons: {
      genZ: option(
        hypothesis(
          "School shootings, 2016, COVID, 2020, January 6, then AI as a public issue — civic life through a phone.",
          [
            entry("election-2016", 2016, "2016 election", "The first presidential race a lot of Z argued in public."),
            entry("parkland", 2018, "Parkland", "The shooting that produced a youth movement, not only a drill."),
            entry("covid", 2020, "COVID-19", "A public-health event that ate school and work."),
            entry("george-floyd", 2020, "George Floyd / 2020 uprising", "The largest youth-visible protest cycle of their teens."),
            entry("jan6", 2021, "January 6", "A coup attempt as a livestream."),
            entry("dobbs", 2022, "Dobbs", "A Supreme Court shock that rearranged teenage political talk."),
            entry("election-2024", 2024, "2024 election", "The second Trump election of their short political memory."),
          ],
          canonSupport("Gen Z", "2016 through COVID, 2020, January 6, and Dobbs."),
          years.genZ,
        ),
        "Z argued 2016 and walked out after Parkland. Alpha absorbed 2020 and 2024 without a vote. Same years, less agency.",
        "A 17-year-old organizes a walkout. A 7-year-old asks why the teacher looks tired.",
        caveatCanon,
      ),
      millennials: option(
        hypothesis(
          "9/11, two wars, a crash, Obama, then 2016 — the news as a young-adult plot.",
          [
            entry("september-11", 2001, "September 11", "The public event that splits millennial memory into before and after."),
            entry("iraq-war", 2003, "Iraq War", "A war they could be sent to, argued about, or both."),
            entry("financial-crisis", 2008, "Financial crisis", "The economy as a personal insult."),
            entry("obama", 2008, "Obama 2008", "A political high they still date things by."),
            entry("occupy", 2011, "Occupy / Arab Spring", "Square and feed as the same civic space."),
            entry("election-2016", 2016, "2016 election", "The plot twist of their thirties."),
            entry("covid", 2020, "COVID as parents and workers", "Policy they had to execute at the kitchen table."),
          ],
          canonSupport("Millennials", "9/11, Iraq, the crash, Obama, then 2016."),
          years.millennials,
        ),
        "Millennials got 9/11 as young adults. Alpha got COVID as children. Both are generation-wide interruptions. Only one included a draft-age war.",
        "A first vote after a crash vs. a first newsfeed during a pandemic.",
        caveatCanon,
      ),
      genX: option(
        hypothesis(
          "The Cold War’s end, a live-TV war, Clinton/impeachment, Columbine — then 9/11 as adults.",
          [
            entry("berlin-wall", 1989, "End of the Cold War", "The map they drew in school got redrawn."),
            entry("gulf-war", 1991, "Gulf War", "Night-vision war on cable."),
            entry("clinton", 1998, "Clinton impeachment", "Politics as a sex scandal on daytime TV."),
            entry("columbine", 1999, "Columbine", "The school-violence template."),
            entry("bush-gore", 2000, "Bush v. Gore", "An election that ended in the Supreme Court."),
            entry("september-11", 2001, "September 11 as adults", "The same day millennials met as young people."),
          ],
          canonSupport("Gen X", "Cold War’s end, Gulf War, impeachment, Columbine, then 9/11 as adults."),
          years.genX,
        ),
        "X watched the Wall fall. Alpha watched school close. Both are “the world changed at my desk” stories.",
        "A classroom globe vs. a classroom Zoom password.",
        caveatCanon,
      ),
      boomers: option(
        hypothesis(
          "Assassinations, civil rights, Vietnam, Watergate — the news as a moral education on three channels.",
          [
            entry("jfk", 1963, "JFK", "The assassination that taught a country to watch together."),
            entry("civil-rights", 1964, "Civil Rights Act years", "Law and protest on the same newscast."),
            entry("vietnam", 1968, "Vietnam", "A war with a draft and a nightly body count."),
            entry("mlk", 1968, "1968 assassinations", "MLK and RFK in one spring."),
            entry("watergate", 1974, "Watergate", "A president leaving by helicopter."),
            entry("reagan", 1980, "Reagan era", "The conservative turn as they entered midlife."),
          ],
          canonSupport("Boomers", "JFK through Vietnam and Watergate as the civic plot."),
          years.boomers,
        ),
        "Boomers had a draft. Alpha has a feed. Civic seriousness is not the difference. Whether the event could take your body is.",
        "A lottery number vs. a push alert.",
        caveatCanon,
      ),
    },
    pairReads: {
      boomers__genX: "Vietnam vs. the Gulf War. One could take you. The other you watched in night vision.",
      boomers__millennials: "JFK and Watergate vs. 9/11 and Obama. Trust broken on TV, twice, 40 years apart.",
      boomers__genZ: "A draft vs. a walkout. Youth politics with different risks.",
      genX__millennials: "The Wall falls for X. The towers fall for millennials. Both redraw the map.",
      genX__genZ: "Columbine writes the drill. Parkland writes the march. School violence as the grim inheritance.",
      millennials__genZ: "9/11 vs. 2016/COVID. Two different “the country is not what I was promised” plots.",
    },
  },
  {
    id: "media-mix",
    title: "Media mix",
    kind: "measured",
    prompt: "The one comparison in this set we can actually score with surveys — knowing the age bands are messy.",
    method: "PwC for Alpha, Deloitte for Z, Pew adult age bands as proxies for older cohorts. Not a single instrument.",
    genAlpha: measured(
      "Media is a living room where video, games, creators, and chat happen at once — not a lineup you finish.",
      "7-14",
      "United States",
      "2026",
      "direct cohort evidence",
      ["pwc-alpha-2026"],
      ["evidence-media-video-default-2"],
      {
        "evidence-media-video-default-2":
          "Establishes the current Gen Alpha mix of YouTube, gaming platforms, and streaming services as a child snapshot, not a taste ranking.",
      },
      [
        entry("youtube-games", 2026, "YouTube + games + streaming", "The measured mix is simultaneous, not sequential."),
      ],
    ),
    comparisons: {
      genZ: option(
        measured(
          "Gen Z already moved time toward social platforms and user-generated media, and away from TV and movies as a share of the day.",
          "Gen Z, defined as 1997-2010",
          "United States",
          "2025",
          "direct cohort evidence",
          ["deloitte-digital-media-trends-2025"],
          ["evidence-compare-deloitte-genz-media-1"],
          {
            "evidence-compare-deloitte-genz-media-1":
              "Quantifies the Gen Z shift toward social and user-generated media relative to the average consumer.",
          },
          [
            entry("social-ugc", 2025, "54% more time on social/UGC", "26% less time on TV and movies than the average consumer."),
          ],
        ),
        "Z is the rough draft of the participatory mix. Alpha meets that mix while childhood routines are still being formed.",
        "A kid opens YouTube for a walkthrough, spots the creator in the game, then carries the bit into play. An older sibling uses the same apps with a later start date.",
        "The Alpha and Z figures come from different surveys, years, and age scopes. Adjacent environments, not a causal shift.",
        "current cohort snapshot",
      ),
      millennials: option(
        measured(
          "The 30-49 adult band still uses YouTube broadly (92%) and TikTok far less than the youngest adults (44% vs. 63%).",
          "30-49 adult age band; millennial-leaning proxy, not a millennial childhood sample",
          "United States",
          "2025",
          "adult age-band proxy",
          ["pew-adult-social-media-2025"],
          ["evidence-compare-pew-adult-platforms-1"],
          {
            "evidence-compare-pew-adult-platforms-1":
              "Uses Pew’s 30-49 band as a millennial-leaning adult proxy for platform reach, labeled as a proxy rather than a generation sample.",
          },
          [
            entry("yt-tiktok-3049", 2025, "YouTube 92% / TikTok 44%", "Adult reach, not a childhood media diary."),
          ],
        ),
        "Millennial-age adults still live on YouTube. Alpha lives on YouTube plus games plus chat as one room. TikTok is a bigger slice of the younger story.",
        "A parent puts on a video. A child is already inside a second screen that is also a game.",
        "Pew’s 30-49 band in 2025 leans millennial but includes younger Gen X and excludes older millennials. It is a proxy.",
        "current cohort snapshot",
      ),
      genX: option(
        measured(
          "YouTube stays broad across the 30-49 and 50-64 bands (92% and 85%); TikTok drops from 44% to 30%.",
          "30-49 and 50-64 adult age bands; not a Gen X sample",
          "United States",
          "2025",
          "adult age-band proxy",
          ["pew-adult-social-media-2025"],
          ["evidence-compare-pew-adult-platforms-1"],
          {
            "evidence-compare-pew-adult-platforms-1":
              "Supplies age-band platform-use figures that remain explicitly labeled as adult proxies for Gen X.",
          },
          [
            entry("yt-tiktok-x", 2025, "YouTube high / TikTok mid", "Gen X in 2025 crosses two Pew bands."),
          ],
        ),
        "Plan for different discovery defaults: child-first participatory video for Alpha, with the 30-64 adult bands used only as directional proxies.",
        "The kid’s For You page and the parent’s YouTube homepage can share a house and still be different planets.",
        "Gen X was ages 45-60 in 2025, crossing Pew’s 30-49 and 50-64 bands. Directional, not exact.",
        "current cohort snapshot",
      ),
      boomers: option(
        measured(
          "The 65+ adult proxy still shows broad YouTube (64%) and very little TikTok (12%).",
          "65+ adult age band; not a Boomer sample",
          "United States",
          "2025",
          "adult age-band proxy",
          ["pew-adult-social-media-2025"],
          ["evidence-compare-pew-adult-platforms-1"],
          {
            "evidence-compare-pew-adult-platforms-1":
              "Supplies the 65+ YouTube and TikTok figures used as a Boomer-leaning adult proxy, not a generation estimate.",
          },
          [
            entry("yt-tiktok-65", 2025, "YouTube 64% / TikTok 12%", "The 65+ band misses younger boomers."),
          ],
        ),
        "Do not force one channel plan across the household: Alpha’s discovery is participatory. The 65+ proxy is still mostly YouTube.",
        "Grandparent YouTube and grandchild Roblox can look like “screens” from the doorway and still be different media systems.",
        "The 65+ band excludes younger boomers and includes older adults. Directional proxy only.",
        "current cohort snapshot",
      ),
    },
    pairReads: {
      boomers__genX: "Both older adult bands still center YouTube. TikTok is the slope, not the floor.",
      boomers__millennials: "64% YouTube at 65+ vs. 92% at 30-49. Same platform, different saturation. TikTok is the real split.",
      boomers__genZ: "A 12% TikTok 65+ proxy vs. a Z cohort that already spends more time on social/UGC than the average consumer.",
      genX__millennials: "Adjacent adult bands. The interesting number is TikTok’s step-up into the 30-49 group, not YouTube.",
      genX__genZ: "Adult YouTube habits vs. Z’s measured social/UGC surplus. Different instruments, same direction of travel.",
      millennials__genZ: "Millennial-age adults are still YouTube people. Z is already a social/UGC surplus relative to everyone else.",
    },
  },
];

export const getGeneration = (id: GenerationKey) => generations.find((generation) => generation.id === id);

export const getComparisonDimension = (id: string) => comparisonDimensions.find((dimension) => dimension.id === id);

export const getGenerationCohort = (topic: ComparisonDimension, key: GenerationKey): ComparisonCohort =>
  key === "genAlpha" ? topic.genAlpha : topic.comparisons[key].cohort;

export const pairKey = (left: GenerationKey, right: GenerationKey) => {
  const [older, younger] = [left, right].sort((a, b) => generationRank[a] - generationRank[b]);
  return `${older}__${younger}`;
};

export const getPairRead = (topic: ComparisonDimension, left: GenerationKey, right: GenerationKey): string => {
  if (left === right) return "";
  const [older, younger] = [left, right].sort((a, b) => generationRank[a] - generationRank[b]);
  if (younger === "genAlpha") return topic.comparisons[older as ComparisonCohortKey].realDifference;
  return topic.pairReads[`${older}__${younger}`] ?? "";
};

export const overlappingEntryIds = (topic: ComparisonDimension, selected: GenerationKey[]): Set<string> => {
  const counts = new Map<string, number>();
  for (const key of selected) {
    for (const item of getGenerationCohort(topic, key).entries ?? []) {
      counts.set(item.id, (counts.get(item.id) ?? 0) + 1);
    }
  }
  return new Set([...counts.entries()].filter(([, count]) => count > 1).map(([id]) => id));
};

export const getComparisonEvidence = (cohortRecord: ComparisonCohort): ComparisonEvidenceRecord[] =>
  cohortRecord.evidenceIds.map((evidenceId) => {
    const evidence = evidenceById.get(evidenceId);
    if (!evidence) throw new Error(`Unknown comparison evidence: ${evidenceId}`);
    const source = sourceById.get(evidence.sourceId);
    if (!source) throw new Error(`Unknown comparison source: ${evidence.sourceId}`);

    return {
      id: evidence.id,
      sourceId: evidence.sourceId,
      insightIds: evidence.insightIds,
      claim: evidence.claim,
      locator: evidence.locator,
      support: cohortRecord.evidenceSupport[evidenceId],
      sourceTitle: source.title,
      sourceOrganization: source.organization,
      sourceUrl: source.url,
    };
  });

for (const dimension of comparisonDimensions) {
  const requiredPairs = [
    "boomers__genX",
    "boomers__millennials",
    "boomers__genZ",
    "genX__millennials",
    "genX__genZ",
    "millennials__genZ",
  ];
  for (const key of requiredPairs) {
    if (!dimension.pairReads[key]?.trim()) {
      throw new Error(`Missing pair read ${key} on ${dimension.id}`);
    }
  }

  const cohortRecords = [dimension.genAlpha, ...Object.values(dimension.comparisons).map((comparison) => comparison.cohort)];
  for (const cohortRecord of cohortRecords) {
    for (const sourceId of cohortRecord.sourceIds) {
      if (!sourceById.has(sourceId)) throw new Error(`Unknown comparison source: ${sourceId}`);
    }
    for (const evidenceId of cohortRecord.evidenceIds) {
      const evidence = evidenceById.get(evidenceId);
      if (!evidence) throw new Error(`Unknown comparison evidence: ${evidenceId}`);
      if (!cohortRecord.sourceIds.includes(evidence.sourceId)) {
        throw new Error(`Comparison evidence ${evidenceId} uses undeclared source ${evidence.sourceId}`);
      }
      if (!cohortRecord.evidenceSupport[evidenceId]?.trim()) {
        throw new Error(`Comparison evidence ${evidenceId} has no cohort support rationale`);
      }
    }
  }
}
