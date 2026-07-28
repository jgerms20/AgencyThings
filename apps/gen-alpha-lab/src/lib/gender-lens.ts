export type GenderLensId = "boys" | "girls" | "gender-diverse";

export type GenderFinding = {
  metric?: string;
  title: string;
  finding: string;
  interpretation: string;
  evidenceClass: "near-age proxy" | "evidence gap";
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
const trevorSurvey = "https://www.thetrevorproject.org/survey-2024/";

export const genderLenses: GenderLens[] = [
  {
    id: "boys",
    label: "Boys",
    headline: "Gaming is especially visible as a social identity for boys.",
    framing: "Among U.S. teens, boys report more console access, more frequent play, and a stronger gamer identity. The useful insight is about the social infrastructure around play—not a claim that every boy is a gamer.",
    findings: [
      {
        metric: "94%",
        title: "Playing with other people is the default",
        finding: "Among teen boys who play video games, 94% say they play with others in person or online, compared with 82% of girl players.",
        interpretation: "The console can function as a recurring friendship place, so social design and safety boundaries belong in the same conversation.",
        evidenceClass: "near-age proxy",
        sourceTitle: "Teens and Video Games Today",
        sourceOrganization: "Pew Research Center",
        sourceUrl: pewGaming,
      },
      {
        metric: "62%",
        title: "‘Gamer’ is a more common identity label",
        finding: "Six-in-ten teen boys who play video games call themselves gamers, versus 17% of girl players.",
        interpretation: "Gaming can be both an activity and a public identity signal. Do not confuse a group-level gap with an individual child’s interests.",
        evidenceClass: "near-age proxy",
        sourceTitle: "Teens and Video Games Today",
        sourceOrganization: "Pew Research Center",
        sourceUrl: pewGaming,
      },
      {
        metric: "90%",
        title: "Console access is uneven",
        finding: "Nine-in-ten teen boys report access to a game console at home, compared with 76% of teen girls.",
        interpretation: "Access, household purchase, and peer norms help create the difference; the device alone does not explain it.",
        evidenceClass: "near-age proxy",
        sourceTitle: "Teens, Social Media and Technology 2024",
        sourceOrganization: "Pew Research Center",
        sourceUrl: pewSocial,
      },
    ],
    guardrail: "Use this lens to ask better questions about social play, identity, and access. Never use it to assume a boy’s interests or to build a boys-only creative world.",
  },
  {
    id: "girls",
    label: "Girls",
    headline: "Social video is more visible, while play still remains social.",
    framing: "U.S. teen girls report somewhat higher use of TikTok and Instagram and are more likely to say they spend too much time on their phone. These are platform and self-perception patterns, not fixed female traits.",
    findings: [
      {
        metric: "82%",
        title: "Most girl players also play with others",
        finding: "Among teen girls who play video games, 82% say they play with others in person or online.",
        interpretation: "A lower rate than boys should not erase the dominant pattern: multiplayer play is social for girls too.",
        evidenceClass: "near-age proxy",
        sourceTitle: "Teens and Video Games Today",
        sourceOrganization: "Pew Research Center",
        sourceUrl: pewGaming,
      },
      {
        metric: "66%",
        title: "TikTok and Instagram are more commonly reported",
        finding: "Teen girls report TikTok use at 66% versus 59% among boys; Instagram use is 66% versus 56%.",
        interpretation: "This describes a reported pattern, not an innate preference. Creators, peer norms, platform design, and access all shape where attention gathers.",
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
        evidenceClass: "near-age proxy",
        sourceTitle: "How Teens and Parents Approach Screen Time",
        sourceOrganization: "Pew Research Center",
        sourceUrl: pewScreenTime,
      },
    ],
    guardrail: "Design for breadth: girls play games, make things, follow sport, learn with AI, and use social video. A difference in prevalence is not permission to flatten the audience.",
  },
  {
    id: "gender-diverse",
    label: "Gender-diverse youth",
    headline: "The most important finding is what the datasets do not yet show.",
    framing: "Most large youth media surveys still publish binary cuts. That makes nonbinary and trans young people visible in cultural and wellbeing research, but largely absent from comparable Gen Alpha media-behavior tables.",
    findings: [
      {
        title: "Comparable Gen Alpha media cuts are missing",
        finding: "The core media and gaming sources used here report boys and girls, not a statistically stable gender-diverse Gen Alpha subgroup.",
        interpretation: "Do not infer a Gen Alpha behavior split from teen or young-adult LGBTQ+ samples. Label the gap and design research that can include these children safely.",
        evidenceClass: "evidence gap",
        sourceTitle: "U.S. teens and gender identity",
        sourceOrganization: "Pew Research Center",
        sourceUrl: pewGenderIdentity,
      },
      {
        title: "Identity visibility is not behavior measurement",
        finding: "Teen research documents awareness of trans and nonbinary people, but it does not measure a distinct media routine for gender-diverse Gen Alpha children.",
        interpretation: "Representation questions and media-behavior questions are both legitimate, but one cannot substitute for the other.",
        evidenceClass: "evidence gap",
        sourceTitle: "U.S. teens and gender identity",
        sourceOrganization: "Pew Research Center",
        sourceUrl: pewGenderIdentity,
      },
      {
        title: "Wellbeing context is directional only",
        finding: "Large LGBTQ+ youth surveys add essential safety and wellbeing context but use targeted, non-probability recruitment and span ages beyond Gen Alpha.",
        interpretation: "Use this evidence to improve care, belonging, and safeguarding—not to estimate prevalence or invent a media profile.",
        evidenceClass: "evidence gap",
        sourceTitle: "2024 U.S. National Survey on the Mental Health of LGBTQ+ Young People",
        sourceOrganization: "The Trevor Project",
        sourceUrl: trevorSurvey,
      },
    ],
    guardrail: "Invite self-description, protect privacy, avoid forced disclosure, and keep creative worlds open. Inclusion here is a design responsibility, not a demographic stereotype.",
  },
];

export const genderMethodology = {
  sample: "Pew’s 2024 social-media survey used a probability-based panel of 1,391 U.S. teens ages 13–17.",
  proxy: "This is a near-age proxy for older Gen Alpha—not a direct read of the full cohort, especially younger children.",
  measurement: "The figures are self-report. They describe stated access, use, and perception; they do not prove why a difference exists.",
  interpretation: "Read gaps as prompts for qualitative follow-up. Age, race, household resources, geography, disability, and identity can intersect with gender.",
};
