export type EditorialInsight = {
  id: "ai" | "play" | "video" | "influence";
  label: string;
  title: string;
  interpretation: string;
  href: string;
  tone: "acid" | "cyan" | "coral" | "violet";
};

export type CreatorProfile = {
  id: string;
  name: string;
  pronouns: "he" | "she";
  role: string;
  insight: string;
  portrait: string;
  portraitAlt: string;
  profileUrl: string;
  sourceUrl: string;
};

export const editorialInsights: EditorialInsight[] = [
  {
    id: "ai",
    label: "01 / AI",
    title: "AI is a default interface.",
    interpretation:
      "Learning, search, discovery, and making increasingly begin with a system that answers back.",
    href: "/topics/ai",
    tone: "acid"
  },
  {
    id: "play",
    label: "02 / Play",
    title: "Play is social and creative.",
    interpretation:
      "Roblox, Minecraft, and Fortnite are places to gather, make, perform, and solve problems together.",
    href: "/topics/play-create",
    tone: "cyan"
  },
  {
    id: "video",
    label: "03 / Media",
    title: "Video is utility and culture.",
    interpretation:
      "Video entertains, explains, teaches, sets language, and supplies the references that travel between friends.",
    href: "/topics/media",
    tone: "coral"
  },
  {
    id: "influence",
    label: "04 / Influence",
    title: "Influence moves through people and households.",
    interpretation:
      "Creators spark desire and belonging, while parents still control access, permission, and purchase.",
    href: "/topics/influence",
    tone: "violet"
  }
];

export const creators: CreatorProfile[] = [
  {
    id: "mrbeast",
    name: "MrBeast",
    pronouns: "he",
    role: "Architect of scale",
    insight:
      "Turns challenges, prizes, philanthropy, and products into spectacles built to be retold.",
    portrait: "/creators/mrbeast.jpg",
    portraitAlt: "MrBeast",
    profileUrl: "https://www.youtube.com/@MrBeast",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:MrBeast_2023.jpg"
  },
  {
    id: "ishowspeed",
    name: "IShowSpeed",
    pronouns: "he",
    role: "Live energy multiplier",
    insight:
      "Blends gaming, football, travel, music, and extreme reaction into participatory live culture.",
    portrait: "/creators/ishowspeed.jpg",
    portraitAlt: "IShowSpeed",
    profileUrl: "https://www.youtube.com/@IShowSpeed",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:IShowSpeed_at_Trifecta_Somerset,_Singapore.jpg"
  },
  {
    id: "kai-cenat",
    name: "Kai Cenat",
    pronouns: "he",
    role: "Community orchestrator",
    insight:
      "Makes livestreaming feel like a shared event where chat, guests, and the audience shape the show.",
    portrait: "/creators/kai-cenat.jpg",
    portraitAlt: "Kai Cenat",
    profileUrl: "https://www.youtube.com/@KaiCenat",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Kai_Cenat.png"
  },
  {
    id: "aphmau",
    name: "Aphmau",
    pronouns: "she",
    role: "Story-world builder",
    insight:
      "Uses Minecraft roleplay, recurring characters, and humor to create an imaginative fan universe.",
    portrait: "/creators/aphmau.jpg",
    portraitAlt: "Aphmau",
    profileUrl: "https://www.youtube.com/@Aphmau",
    sourceUrl: "https://x.com/_Aphmau_"
  },
  {
    id: "salish-matter",
    name: "Salish Matter",
    pronouns: "she",
    role: "Peer aspiration engine",
    insight:
      "Turns challenges, friendship, lifestyle, and beauty rituals into a model of highly visible teen life.",
    portrait: "/creators/salish-matter.jpg",
    portraitAlt: "Salish Matter",
    profileUrl: "https://www.youtube.com/@salishmatter",
    sourceUrl: "https://www.instagram.com/salishmatter/"
  },
  {
    id: "ms-rachel",
    name: "Ms. Rachel",
    pronouns: "she",
    role: "Early-learning guide",
    insight:
      "Combines songs, repetition, language development, and caregiver trust for younger Gen Alpha.",
    portrait: "/creators/ms-rachel.jpg",
    portraitAlt: "Ms. Rachel",
    profileUrl: "https://www.youtube.com/channel/UCG2CL6EUjG8TVT1Tpl9nJdg",
    sourceUrl: "https://www.msrachel.com/pages/team"
  }
];

export const libraryTakeaways = [
  "Culture moves faster than reports.",
  "Patterns matter more than anecdotes.",
  "Context changes the meaning of every signal."
] as const;
