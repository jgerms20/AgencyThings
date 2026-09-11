export type DemographicShare = {
  label: string;
  value: number;
  count?: string;
  detail?: string;
};

export type DemographicSource = {
  id: string;
  title: string;
  publisher: string;
  date: string;
  url: string;
};

export const demographicHeadlineFacts = [
  {
    label: "Birth years used by this Lab",
    value: "2010–2024",
    detail: "A working definition, not an official Census category.",
  },
  {
    label: "Approximate ages in 2026",
    value: "About 1–16",
    detail: "The exact age depends on birthday and where a boundary is drawn.",
  },
  {
    label: "U.S. ages 0–14",
    value: "59.7M",
    detail: "July 1, 2024 Census estimate; the closest clean cohort proxy.",
  },
  {
    label: "Worldwide ages 0–14",
    value: "2.01B",
    detail: "2024 World Bank estimate using UN age distributions.",
  },
] as const;

export const usSexSplit: DemographicShare[] = [
  { label: "Male", value: 51.1 },
  { label: "Female", value: 48.9 },
];

export const usRaceAlone: DemographicShare[] = [
  { label: "White alone", value: 69.4 },
  { label: "Black alone", value: 15.7 },
  { label: "Asian alone", value: 6.3 },
  { label: "Two or more races", value: 6.3 },
  { label: "American Indian and Alaska Native alone", value: 1.9 },
  { label: "Native Hawaiian and Other Pacific Islander alone", value: 0.4 },
];

export const usEthnicityContext: DemographicShare[] = [
  { label: "Hispanic or Latino, any race", value: 27 },
  { label: "Non-Hispanic White alone", value: 47.2 },
];

export const usRegions: DemographicShare[] = [
  { label: "South", value: 40.2 },
  { label: "West", value: 23.3 },
  { label: "Midwest", value: 20.8 },
  { label: "Northeast", value: 15.8 },
];

export const usTopStates = [
  { label: "California", value: "6.85M", share: 11.5 },
  { label: "Texas", value: "6.29M", share: 10.5 },
] as const;

export const olderTeenIdentity = {
  scope: "2023 U.S. high-school students, not the full Gen Alpha generation",
  sexualIdentity: [
    { label: "Heterosexual", value: 73.3 },
    { label: "Gay or lesbian", value: 4 },
    { label: "Bisexual", value: 11.4 },
    { label: "Questioning", value: 4.4 },
    { label: "Another identity", value: 4.3 },
    { label: "Did not understand the question", value: 2.5 },
  ] satisfies DemographicShare[],
  genderIdentity: [
    { label: "Transgender", value: 3.3 },
    { label: "Questioning whether transgender", value: 2.2 },
    { label: "Neither transgender nor questioning", value: 94.5 },
  ] satisfies DemographicShare[],
} as const;

export const globalRegions: DemographicShare[] = [
  { label: "Sub-Saharan Africa", value: 26.1, count: "~525M" },
  { label: "East Asia & Pacific", value: 21.4, count: "~430M" },
  { label: "South Asia", value: 20.8, count: "~418M" },
  { label: "Middle East, North Africa, Afghanistan & Pakistan", value: 13, count: "~261M" },
  { label: "Europe & Central Asia", value: 8, count: "~161M" },
  { label: "Latin America & Caribbean", value: 7.4, count: "~149M" },
  { label: "North America", value: 3.2, count: "~64M" },
];

export const usPopulationHeadline = {
  value: 59_698_140,
  display: "59.7 million",
  compact: "59.7M",
  disclaimer: "July 2024 Census estimate of U.S. residents ages 0–14 — the closest clean proxy for this Lab’s 2010–2024 working definition, not an official “Gen Alpha” count.",
} as const;

export const globalYouthHeadline = {
  value: 2_010_000_000,
  display: "2.01 billion",
  compact: "2.01B",
  detail: "people ages 0–14 worldwide in 2024",
} as const;

export const generationBoundaryCopy = {
  kicker: "Generation boundaries are conventions",
  opening:
    "There is no official Census category called Gen Alpha. This Lab uses 2010–2024 as a working definition so age-based population data can be read honestly — and so it is clear exactly where each measure stops.",
} as const;

export const demographicSynthesis = {
  title: "The youth majority is already outside North America.",
  body: "North America is only 3.2% of the world’s ages 0–14 population. That is the map. The culture point sits beside it: what counts as global cool is no longer a one-way U.S. export.",
} as const;

export const globalCultureShift = {
  kicker: "Compared with previous generations",
  title: "Youth culture is no longer a U.S. export first.",
  stat: "96.8%",
  statLabel: "of ages 0–14 live outside North America",
  thenLabel: "Then",
  thenTitle: "U.S. export",
  thenBody: "Boomers through early Millennials. “Global culture” mostly meant American culture traveling outward.",
  nowLabel: "Now",
  nowTitle: "Many centers",
  nowBody: "Alpha is growing up where what’s cool is already being made in many countries at once. The future of pop culture is not a U.S. broadcast.",
  names: ["Bad Bunny", "BTS", "KPop Demon Hunters", "Lamine Yamal"],
} as const;

export const globalCoverageNote =
  "There is no combined global race, ethnicity, sexual-orientation, or gender-identity rollup here. Countries do not measure those categories consistently enough to combine them responsibly.";

export const demographicSources: DemographicSource[] = [
  {
    id: "census-age-sex",
    title: "National population estimates by age and sex",
    publisher: "U.S. Census Bureau",
    date: "July 1, 2024",
    url: "https://www2.census.gov/programs-surveys/popest/datasets/2020-2024/national/asrh/nc-est2024-agesex-res.csv",
  },
  {
    id: "census-race",
    title: "National population estimates by age, sex, race, and Hispanic origin",
    publisher: "U.S. Census Bureau",
    date: "July 1, 2024",
    url: "https://www2.census.gov/programs-surveys/popest/datasets/2020-2024/national/asrh/nc-est2024-alldata-r-file10.csv",
  },
  {
    id: "census-states",
    title: "State population estimates by age and sex",
    publisher: "U.S. Census Bureau",
    date: "July 1, 2024",
    url: "https://www2.census.gov/programs-surveys/popest/datasets/2020-2024/state/asrh/sc-est2024-agesex-civ.csv",
  },
  {
    id: "cdc-sexual-identity",
    title: "Youth Risk Behavior Survey data and methods",
    publisher: "Centers for Disease Control and Prevention",
    date: "2023",
    url: "https://www.cdc.gov/mmwr/volumes/73/su/su7304a1.htm",
  },
  {
    id: "cdc-gender-identity",
    title: "Transgender identity and questioning among U.S. high-school students",
    publisher: "Centers for Disease Control and Prevention",
    date: "2023",
    url: "https://www.cdc.gov/mmwr/volumes/73/su/su7304a6.htm",
  },
  {
    id: "world-population",
    title: "Population ages 0–14, total",
    publisher: "World Bank, using UN Population Division data",
    date: "2024",
    url: "https://data.worldbank.org/indicator/SP.POP.0014.TO?locations=1W",
  },
];

export const deeperRoutes = [
  {
    title: "How they live",
    description: "Play, media, time, and learning — what their days feel like once you leave the census tables.",
    href: "/insights",
    action: "Explore insights",
  },
  {
    title: "How generations differ",
    description: "Compare cohorts without turning age into a stereotype or a contest.",
    href: "/compare",
    action: "Compare generations",
  },
  {
    title: "Who shapes culture",
    description: "Meet the creators, franchises, athletes, and characters in the mix.",
    href: "/influencers",
    action: "Browse influencers",
  },
  {
    title: "Check the evidence",
    description: "See the source records, markets, dates, methods, and confidence notes behind the Lab.",
    href: "/library",
    action: "Open Sources",
  },
] as const;

export const getDemographicSource = (id: DemographicSource["id"]) =>
  demographicSources.find((source) => source.id === id);
