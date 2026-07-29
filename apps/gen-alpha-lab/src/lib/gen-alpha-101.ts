export type Alpha101Fact = {
  number: string;
  title: string;
  explanation: string;
  href: string;
};

export const alpha101Facts: Alpha101Fact[] = [
  { number: "01", title: "Gen Alpha is not one life stage.", explanation: "The label stretches from toddlers to high-schoolers. Always ask which age you actually mean.", href: "/library" },
  { number: "02", title: "Digital and physical life are one day.", explanation: "A friendship can move from Roblox to school to a bike ride and back without feeling like separate worlds.", href: "/insights/play-friendship-travels" },
  { number: "03", title: "A personal screen is not full independence.", explanation: "Parents still set permissions, contacts, payments, bedtimes, and the rules around what happens next.", href: "/insights/time-device-access" },
  { number: "04", title: "Play is social infrastructure.", explanation: "Games are places to talk, build, compete, learn, and keep a friendship going—not only places to escape.", href: "/insights/play-social-infrastructure" },
  { number: "05", title: "Video is an everything screen.", explanation: "YouTube can be entertainment, search, a walkthrough, music, sports commentary, and background company in the same afternoon.", href: "/insights/media-video-default" },
  { number: "06", title: "Creators teach formats, not just taste.", explanation: "A challenge, build, family routine, or reaction becomes something children can recognize, repeat, and share.", href: "/influencers" },
  { number: "07", title: "AI has joined the homework stack.", explanation: "A question can move through a teacher, tutorial, search result, chatbot, parent, and friend. Verification matters as much as access.", href: "/insights/learning-ai-homework" },
  { number: "08", title: "Influence and purchase are different jobs.", explanation: "A child can discover a product in a creator video, request it, compare it, or save it while an adult still controls permission and payment.", href: "/insights/learning-commercial-fluency" },
  { number: "09", title: "Identity gets rehearsed through making.", explanation: "Avatars, clips, drawings, collections, sport, fashion, and stories all give children a way to try on belonging.", href: "/insights/learning-remix" },
  { number: "10", title: "Gen Alpha is more than ‘kids today.’", explanation: "The useful question is what has changed in discovery, participation, learning, and household negotiation—not what is timeless about childhood.", href: "/compare" },
];

export const knowledgeStages = [
  { number: "01", title: "Audience truths", description: "Start with what the current evidence says about their lives.", href: "/insights" },
  { number: "02", title: "Marketing 101", description: "See the practices youth marketers already tend to recommend.", href: "/reach-them" },
  { number: "03", title: "Research frontier", description: "Open the hunches and gaps that could become original agency work.", href: "/summary#research-frontier" },
] as const;
