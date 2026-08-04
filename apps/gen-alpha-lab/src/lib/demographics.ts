export type DemographicShare = {
  label: string;
  value: number;
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
  { label: "Sub-Saharan Africa", value: 26.1 },
  { label: "East Asia & Pacific", value: 21.4 },
  { label: "South Asia", value: 20.8 },
  { label: "Middle East, North Africa, Afghanistan & Pakistan", value: 13 },
  { label: "Europe & Central Asia", value: 8 },
  { label: "Latin America & Caribbean", value: 7.4 },
  { label: "North America", value: 3.2 },
];

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
    title: "What their days feel like",
    description: "Move from demographic context into play, learning, media, identity, and family life.",
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
