export type GenderLensId = "boys" | "girls" | "gender-diverse";
export type GenderSignal = "difference" | "counter-pattern" | "evidence gap";

export type GenderFinding = {
  metric?: string;
  title: string;
  finding: string;
  interpretation: string;
  signal: GenderSignal;
  evidenceClass: "direct child" | "near-age proxy" | "contextual evidence" | "evidence gap";
  sourceTitle: string;
  sourceOrganization: string;
  sourceUrl: string;
};

export type GenderLens = {
  id: GenderLensId;
  label: string;
  headline: string;
  framing: string;
  findings: GenderFinding[];
  guardrail: string;
};

const pewGaming = "https://www.pewresearch.org/internet/2024/05/09/teens-and-video-games-today/";
const pewSocial = "https://www.pewresearch.org/internet/2024/12/12/teens-social-media-and-technology-2024/";
const pewScreenTime = "https://www.pewresearch.org/internet/2024/03/11/how-teens-and-parents-approach-screen-time/";
const pewGenderIdentity = "https://www.pewresearch.org/short-reads/2025/01/24/us-teens-are-less-likely-than-adults-to-know-a-trans-person-more-likely-to-know-someone-whos-nonbinary/";
const commonSense = "https://www.commonsensemedia.org/sites/default/files/research/report/2025-common-sense-census-web-2.pdf";
const ofcom = "https://www.ofcom.org.uk/siteassets/resources/documents/research-and-data/media-literacy-research/children/2026-children-and-parents-report/children-and-parents-media-use-and-attitudes-report-2025-6.pdf?v=418231";
const ofcomNation = "https://www.ofcom.org.uk/media-use-and-attitudes/online-habits/from-apps-to-ai-search-how-the-uk-goes-online-in-2025";
const cdcGender = "https://www.cdc.gov/mmwr/volumes/73/su/su7304a6.htm";
const transSupport = "https://pubmed.ncbi.nlm.nih.gov/31690534/";

export const genderLenses: GenderLens[] = [
  {
    id: "boys",
    label: "Boys",
    headline: "Gaming is a stronger identity signal—and a larger exposure surface.",
    framing: "The direct-child evidence shows longer screen and gaming time plus more console use among boys. Teen evidence adds gamer identity, social play, and harassment. The contradiction matters: participation and exposure rise together.",
    findings: [
      {
        metric: "2:38",
        title: "The early-childhood screen day is longer",
        finding: "Boys ages 0–8 average 2 hours 38 minutes of screen media per day, compared with 2 hours 7 minutes for girls.",
        interpretation: "This is a measured time gap, not an explanation. Age, content, device mix, household resources, and the activity itself still shape meaning.",
        signal: "difference",
        evidenceClass: "direct child",
        sourceTitle: "The 2025 Common Sense Census: Media Use by Kids Zero to Eight",
        sourceOrganization: "Common Sense Media",
        sourceUrl: commonSense,
      },
      {
        metric: "45 min",
        title: "Gaming time diverges before the teen years",
        finding: "Boys ages 0–8 average 45 minutes of daily gaming across devices, compared with 29 minutes for girls.",
        interpretation: "Console time creates most of the difference; smartphone, computer, and handheld gaming are more similar than the total suggests.",
        signal: "difference",
        evidenceClass: "direct child",
        sourceTitle: "The 2025 Common Sense Census: Media Use by Kids Zero to Eight",
        sourceOrganization: "Common Sense Media",
        sourceUrl: commonSense,
      },
      {
        metric: "62%",
        title: "Console use is the clearest device difference",
        finding: "Among U.K. children ages 3–17, 62% of boys use consoles for gaming compared with 38% of girls; other gaming devices are more evenly split.",
        interpretation: "Access and household purchase help produce the visible culture around console play. Do not mistake a hardware gap for a universal preference.",
        signal: "difference",
        evidenceClass: "direct child",
        sourceTitle: "Children and Parents: Media Use and Attitudes Report 2025–6",
        sourceOrganization: "Ofcom",
        sourceUrl: ofcom,
      },
      {
        metric: "94%",
        title: "Playing with other people is the default",
        finding: "Among teen boys who play video games, 94% play with others in person or online, compared with 82% of girl players.",
        interpretation: "The console can function as recurring friendship infrastructure, so social design and safety boundaries belong in the same conversation.",
        signal: "counter-pattern",
        evidenceClass: "near-age proxy",
        sourceTitle: "Teens and Video Games Today",
        sourceOrganization: "Pew Research Center",
        sourceUrl: pewGaming,
      },
      {
        metric: "62%",
        title: "‘Gamer’ is a more common identity label",
        finding: "Six-in-ten teen boys who play video games call themselves gamers, versus 17% of girl players.",
        interpretation: "Gaming can be both an activity and a public identity signal. A group-level gap still cannot predict an individual child’s interests.",
        signal: "difference",
        evidenceClass: "near-age proxy",
        sourceTitle: "Teens and Video Games Today",
        sourceOrganization: "Pew Research Center",
        sourceUrl: pewGaming,
      },
      {
        metric: "48%",
        title: "More contact also means more direct harassment",
        finding: "Nearly half of teen boy players report being called an offensive name in a game, compared with 32% of girl players.",
        interpretation: "Participation and exposure rise together. Friendship value does not cancel the need for contact controls, reporting, moderation, and adult support.",
        signal: "counter-pattern",
        evidenceClass: "near-age proxy",
        sourceTitle: "Teens and Video Games Today",
        sourceOrganization: "Pew Research Center",
        sourceUrl: pewGaming,
      },
    ],
    guardrail: "Use this lens to ask better questions about social play, identity, access, and exposure. Never use it to assume a boy’s interests or build a boys-only creative world.",
  },
  {
    id: "girls",
    label: "Girls",
    headline: "Social connection, reading, gaming, and pressure coexist.",
    framing: "The girls lens becomes useful when it holds apparent contradictions: gaming is widespread even when gamer identity is lower; online spaces can strengthen friendship while also intensifying popularity pressure; reading and social video both have stronger signals.",
    findings: [
      {
        metric: "86%",
        title: "Girls gaming is close to universal",
        finding: "Among U.K. children ages 3–17, 86% of girls play games on some kind of device, compared with 91% of boys.",
        interpretation: "A console and identity gap should not be read as an absence of play. Girls’ device and genre mix makes the behavior less culturally visible.",
        signal: "counter-pattern",
        evidenceClass: "direct child",
        sourceTitle: "Children and Parents: Media Use and Attitudes Report 2025–6",
        sourceOrganization: "Ofcom",
        sourceUrl: ofcom,
      },
      {
        metric: "59%",
        title: "Daily reading has an early-childhood edge",
        finding: "Girls ages 0–8 are more likely to read or be read to every day than boys: 59% versus 50%.",
        interpretation: "This is a routine-level difference, not an ability claim. Household income, race and ethnicity, and parent education also produce large reading gaps.",
        signal: "difference",
        evidenceClass: "direct child",
        sourceTitle: "The 2025 Common Sense Census: Media Use by Kids Zero to Eight",
        sourceOrganization: "Common Sense Media",
        sourceUrl: commonSense,
      },
      {
        metric: "38%",
        title: "Popularity pressure is reported more often",
        finding: "Girls ages 8–17 who use social or messaging apps are more likely to feel pressure to be popular most or all of the time: 38% versus 29% of boys.",
        interpretation: "Social value and social pressure can be present in the same service. Safety design should preserve connection while reducing public evaluation and escalation.",
        signal: "difference",
        evidenceClass: "direct child",
        sourceTitle: "Children and Parents: Media Use and Attitudes Report 2025–6",
        sourceOrganization: "Ofcom",
        sourceUrl: ofcom,
      },
      {
        metric: "71%",
        title: "Online life is more often credited with friendship",
        finding: "U.K. girls ages 13–17 are more likely than boys to say being online helps build and maintain friendships: 71% versus 60%.",
        interpretation: "This complicates a harm-only reading of social media. Connection quality, privacy, and pressure need to be evaluated together.",
        signal: "counter-pattern",
        evidenceClass: "near-age proxy",
        sourceTitle: "From apps to AI search: how the UK goes online in 2025",
        sourceOrganization: "Ofcom",
        sourceUrl: ofcomNation,
      },
      {
        metric: "66%",
        title: "TikTok and Instagram are more commonly reported",
        finding: "Teen girls report TikTok use at 66% versus 59% among boys; Instagram use is 66% versus 56%.",
        interpretation: "This describes a reported platform pattern, not an innate preference. Creators, peer norms, design, and access help shape where attention gathers.",
        signal: "difference",
        evidenceClass: "near-age proxy",
        sourceTitle: "Teens, Social Media and Technology 2024",
        sourceOrganization: "Pew Research Center",
        sourceUrl: pewSocial,
      },
      {
        metric: "44%",
        title: "Phone time is more often described as ‘too much’",
        finding: "Teen girls are more likely than boys to say they spend too much time on their smartphone: 44% versus 33%.",
        interpretation: "Self-assessment adds emotional context to minutes. It does not prove cause, harm, or a universal experience.",
        signal: "counter-pattern",
        evidenceClass: "near-age proxy",
        sourceTitle: "How Teens and Parents Approach Screen Time",
        sourceOrganization: "Pew Research Center",
        sourceUrl: pewScreenTime,
      },
    ],
    guardrail: "Design for breadth: girls game, make, read, follow sport, learn with AI, use social video, and maintain friendships online. A prevalence difference is not permission to flatten the audience.",
  },
  {
    id: "gender-diverse",
    label: "Gender-diverse youth",
    headline: "Visibility is measurable. A distinct Gen Alpha media profile is not.",
    framing: "Binary media tables cannot describe this audience. National youth data establishes that trans and questioning students are present and face distinct safety conditions, while smaller qualitative studies explain why online spaces can matter. None of that supports inventing a Gen Alpha media routine.",
    findings: [
      {
        metric: "3.3%",
        title: "Trans students are visible in national data",
        finding: "In the 2023 national Youth Risk Behavior Survey, 3.3% of U.S. high school students identified as transgender.",
        interpretation: "Presence can now be estimated in a national high-school sample, but this is not a Gen Alpha media-behavior measure.",
        signal: "counter-pattern",
        evidenceClass: "contextual evidence",
        sourceTitle: "Disparities Among Transgender and Cisgender High School Students",
        sourceOrganization: "U.S. Centers for Disease Control and Prevention",
        sourceUrl: cdcGender,
      },
      {
        metric: "2.2%",
        title: "Questioning youth are a separate measured group",
        finding: "An additional 2.2% of U.S. high school students said they were questioning whether they identify as transgender.",
        interpretation: "Research and experiences need room for uncertainty. Do not force a child into a fixed category to make a comparison table work.",
        signal: "counter-pattern",
        evidenceClass: "contextual evidence",
        sourceTitle: "Disparities Among Transgender and Cisgender High School Students",
        sourceOrganization: "U.S. Centers for Disease Control and Prevention",
        sourceUrl: cdcGender,
      },
      {
        title: "Comparable media cuts are still missing",
        finding: "The core child media, gaming, and screen-time sources used here publish boys-and-girls cuts without a statistically stable gender-diverse Gen Alpha subgroup.",
        interpretation: "Label the evidence gap. Do not infer a media routine from wellbeing evidence or from older, targeted LGBTQ+ samples.",
        signal: "evidence gap",
        evidenceClass: "evidence gap",
        sourceTitle: "U.S. teens and gender identity",
        sourceOrganization: "Pew Research Center",
        sourceUrl: pewGenderIdentity,
      },
      {
        metric: "28%",
        title: "Nonbinary identity is present in teen social worlds",
        finding: "More than one-quarter of U.S. teens say they personally know someone who is nonbinary; girls and older teens report this more often.",
        interpretation: "Identity visibility is relevant to representation and social context, but knowing someone is not a behavior profile.",
        signal: "counter-pattern",
        evidenceClass: "near-age proxy",
        sourceTitle: "U.S. teens are more likely to know someone who’s nonbinary",
        sourceOrganization: "Pew Research Center",
        sourceUrl: pewGenderIdentity,
      },
      {
        metric: "25.3%",
        title: "Safety and belonging are not side issues",
        finding: "About one-quarter of transgender high school students skipped school because they felt unsafe, compared with 8.5% of cisgender male students.",
        interpretation: "Use this as safety and belonging context. Do not infer a media routine from wellbeing evidence or turn a risk disparity into an identity trait.",
        signal: "difference",
        evidenceClass: "contextual evidence",
        sourceTitle: "Disparities Among Transgender and Cisgender High School Students",
        sourceOrganization: "U.S. Centers for Disease Control and Prevention",
        sourceUrl: cdcGender,
      },
      {
        metric: "25 interviews",
        title: "Online community can provide otherwise-missing support",
        finding: "A qualitative study of transgender adolescents found emotional, informational, and identity-validating support in online communities, alongside harassment and exclusion.",
        interpretation: "The small clinic-recruited sample supplies mechanism and lived context, not prevalence or a representative Gen Alpha estimate.",
        signal: "counter-pattern",
        evidenceClass: "contextual evidence",
        sourceTitle: "Transgender Adolescents’ Uses of Social Media for Social Support",
        sourceOrganization: "Journal of Adolescent Health",
        sourceUrl: transSupport,
      },
    ],
    guardrail: "Invite self-description, protect privacy, avoid forced disclosure, and keep creative worlds open. Inclusion is a design responsibility, not a demographic stereotype.",
  },
];

export const genderMethodology = {
  sample: "Pew’s 2024 social-media survey used a probability-based panel of 1,391 U.S. teens ages 13–17; the Common Sense and Ofcom findings add direct child samples.",
  proxy: "Teen findings are a near-age proxy for older Gen Alpha—not a direct read of the full cohort, especially younger children.",
  measurement: "Most figures are self-report or parent report. They describe stated access, use, and perception; they do not prove why a difference exists.",
  interpretation: "Read gaps as prompts for qualitative follow-up. Age, race, household resources, geography, disability, and identity intersect with gender.",
};
