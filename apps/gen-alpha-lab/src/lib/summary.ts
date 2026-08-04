export type SummarySource = {
  organization: string;
  title: string;
  url: string;
};

export type SummaryTakeaway = {
  id: string;
  number: string;
  headline: string;
  takeaway: string;
  support: [string, string];
  insightId: string;
  sources: SummarySource[];
};

export const summaryTakeaways: SummaryTakeaway[] = [
  {
    id: "personal-before-independent",
    number: "01",
    headline: "Personal devices arrive before personal independence.",
    takeaway: "A screen can feel private while permission, payment, privacy, bedtime, and support still run through a household.",
    support: [
      "Device access expands faster than a child’s authority over accounts, purchases, and rules.",
      "The household—not the individual child—is the practical unit for media decisions.",
    ],
    insightId: "time-device-access",
    sources: [
      { organization: "Common Sense Media", title: "The 2025 Common Sense Census", url: "https://www.commonsensemedia.org/research/the-2025-common-sense-census-media-use-by-kids-zero-to-eight" },
      { organization: "Pew Research Center", title: "How Teens and Parents Approach Screen Time", url: "https://www.pewresearch.org/internet/2024/03/11/how-teens-and-parents-approach-screen-time/" },
    ],
  },
  {
    id: "play-is-social",
    number: "02",
    headline: "Play is social infrastructure, not an escape from social life.",
    takeaway: "The same friendship can move through school, a game, voice chat, clips, and offline time without children treating those as separate worlds.",
    support: [
      "Games function as places to spend time together, not only products to consume.",
      "Conflict and belonging travel through the same connected play system.",
    ],
    insightId: "play-social-infrastructure",
    sources: [
      { organization: "Pew Research Center", title: "Teens and Video Games Today", url: "https://www.pewresearch.org/internet/2024/05/09/teens-and-video-games-today/" },
      { organization: "Walton Family Foundation / Bodacious", title: "The Creation Generation", url: "https://www.waltonfamilyfoundation.org/bodacious-and-walton-family-foundation-unveil-new-report-on-generation-alphas-use-of-creation-gaming-for-learning-and-development" },
    ],
  },
  {
    id: "video-everything-screen",
    number: "03",
    headline: "Video is simultaneously entertainment, search, fandom, music, sport, and family ritual.",
    takeaway: "Creator media and traditional IP now overlap across phones, tablets, and the largest shared screen in the home.",
    support: [
      "Children move between clips, explainers, streams, music, and long-form viewing fluidly.",
      "The meaning of video comes from the need it serves, not the channel carrying it.",
    ],
    insightId: "media-video-default",
    sources: [
      { organization: "Common Sense Media", title: "The 2025 Common Sense Census", url: "https://www.commonsensemedia.org/research/the-2025-common-sense-census-media-use-by-kids-zero-to-eight" },
      { organization: "Ofcom", title: "Children and Parents: Media Use and Attitudes 2025–26", url: "https://www.ofcom.org.uk/siteassets/resources/documents/research-and-data/media-literacy-research/children/2026-children-and-parents-report/children-and-parents-media-use-and-attitudes-report-2025-6.pdf?v=418231" },
    ],
  },
  {
    id: "ai-learning-stack",
    number: "04",
    headline: "AI is already one tool among search, video, teachers, family, and peers.",
    takeaway: "The useful question is how children verify, disclose, and use AI with support—not whether they encounter it.",
    support: [
      "Conversational answers join an existing mix of tutorial video, search, and human help.",
      "Judgment and verification matter more than treating AI as a standalone destination.",
    ],
    insightId: "learning-ai-homework",
    sources: [
      { organization: "Ofcom", title: "From apps to AI search: how the UK goes online in 2025", url: "https://www.ofcom.org.uk/media-use-and-attitudes/online-habits/from-apps-to-ai-search-how-the-uk-goes-online-in-2025" },
      { organization: "Common Sense Media", title: "AI Use by Tweens and Teens 2026", url: "https://www.commonsensemedia.org/press-releases/common-sense-media-releases-inaugural-annual-study-on-ai-use-by-tweens-and-teens" },
    ],
  },
  {
    id: "identity-workshop",
    number: "05",
    headline: "Play, avatars, clips, stories, and making form one identity workshop.",
    takeaway: "Children do not only consume culture; they rehearse roles, remix formats, and signal affiliation through what they make and share.",
    support: [
      "Creation and consumption increasingly happen inside the same experience.",
      "The strongest formats give children a meaningful role, not just a message.",
    ],
    insightId: "learning-remix",
    sources: [
      { organization: "Walton Family Foundation / Bodacious", title: "The Creation Generation", url: "https://www.waltonfamilyfoundation.org/bodacious-and-walton-family-foundation-unveil-new-report-on-generation-alphas-use-of-creation-gaming-for-learning-and-development" },
      { organization: "Pew Research Center", title: "Teens and Video Games Today", url: "https://www.pewresearch.org/internet/2024/05/09/teens-and-video-games-today/" },
    ],
  },
  {
    id: "context-over-minutes",
    number: "06",
    headline: "Context—not screen time alone—determines what a media day means.",
    takeaway: "Age, purpose, content, social setting, household resources, and adult support can make identical minute counts describe very different days.",
    support: [
      "A shared call, homework session, creative build, and passive scroll should not collapse into one measure.",
      "Interpret the whole routine before judging the number of minutes.",
    ],
    insightId: "time-household-context",
    sources: [
      { organization: "Common Sense Media", title: "The 2025 Common Sense Census", url: "https://www.commonsensemedia.org/research/the-2025-common-sense-census-media-use-by-kids-zero-to-eight" },
      { organization: "Pew Research Center", title: "How Teens and Parents Approach Screen Time", url: "https://www.pewresearch.org/internet/2024/03/11/how-teens-and-parents-approach-screen-time/" },
    ],
  },
];
