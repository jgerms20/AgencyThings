export const humorStudy = {
  kicker: "From the Snapchat × Omnicom report, August 2026",
  title: "How Next Gen laughs.",
  lede: "Humor is how this generation talks about serious things. Next Gen here is 13–28, not the Lab’s full 0–16 Alpha portrait.",
  sample: "6,028 daily social-app users. U.S., U.K., Canada, France, Germany, India.",
  sourceId: "snap-omnicom-humor-2026",
  sourceUrl: "https://forbusiness.snapchat.com/blog/how-to-laugh-and-win-nextgen",
  pdfUrl:
    "https://assets.ctfassets.net/inb32lme5009/TZGY2B1lSn6jsFVPVF4oS/0f67fabbc1989c8ff0b0875c97d3a218/How_to_Laugh__And_Win__With_Next_Gen_GLOBAL__1_.pdf",
  caveat:
    "Next Gen here is younger Gen Z plus older Gen Alpha. It is a social-app-user sample, not a census of every child, and Snap commissioned the work.",
} as const;

export const humorQuotes = [
  {
    quote:
      "I’d say our humour is quite sarcastic, a bit self-deprecating, and often pretty absurd. We lean heavily on irony, inside jokes, and making light of awkward everyday situations.",
    voice: "14, female, U.K.",
  },
  {
    quote:
      "There’s quite a lot of absurdism and self-deprecating humor, and post irony seems to be a big thing. Memes play the biggest role in this, as well as the internet in general.",
    voice: "15, female, Canada",
  },
  {
    quote:
      "What we find funny isn't necessarily the joke itself, but the incongruity, the irony, or the fact that it's so stupid it's funny.",
    voice: "17, female, France",
  },
] as const;

export const humorHeadlineStats = [
  {
    value: 82,
    suffix: "%",
    label: "This is how they talk about serious things",
  },
  {
    value: 67,
    suffix: "%",
    label: "Pick friends by their sense of humor",
  },
  {
    value: 75,
    suffix: "%",
    label: "Brands online feel like uncs trying to joke",
    display: "3 in 4",
  },
  {
    value: 57,
    suffix: "%",
    label: "Who gets it matters more than how many liked it",
  },
] as const;

export const humorMechanics = [
  {
    number: "01",
    title: "Context is the punchline",
    stat: "93%",
    detail: "Something becomes funny because of how it is presented, not just what it is. 87% say you have to get the reference. 79% say explaining a joke usually ruins it.",
  },
  {
    number: "02",
    title: "Random has rules",
    stat: "92%",
    detail: "“Completely random” is the #1 type they enjoy — and they still say the best jokes seem random but have logic behind them.",
  },
  {
    number: "03",
    title: "Irony is infrastructure",
    stat: "91%",
    detail: "Things can be funny and serious at the same time. A joke does not need a clean punchline. Caring and mocking can occupy the same sentence.",
  },
  {
    number: "04",
    title: "Escalate or die",
    stat: "88%",
    detail: "Humor gets funnier the more it builds. Remix, reaction, continuation. Copying a frozen meme is how a brand becomes the joke.",
  },
] as const;

export const humorTiming = [
  {
    id: "too-early",
    title: "Too early",
    line: "Who invited the parent?",
    detail: "The room is still forming the language. Watch. Do not announce that you found it.",
  },
  {
    id: "just-right",
    title: "Goldilocks",
    line: "Okay they kinda ate.",
    detail: "People are already remixing. Add a layer. Give them something to send, not a lecture.",
  },
  {
    id: "too-late",
    title: "Too late",
    line: "Unc found the meme.",
    detail: "Media is explaining the joke. The joke has become the joke. Own being late, or sit it out.",
  },
] as const;

export const humorLifecycle = [
  { stage: "Discovery", line: "Wait, that's actually funny." },
  { stage: "Sharing", line: "You need to see this." },
  { stage: "Social identity", line: "IYKYK." },
  { stage: "Real life", line: "Remember that thing?" },
  { stage: "Remix", line: "And then..." },
  { stage: "Rediscovery", line: "Wait, have you seen this?" },
] as const;

export const snapchatHumor = [
  {
    value: 5.7,
    decimals: 1,
    suffix: "×",
    label: "More likely to be shared than discovered on Snapchat",
  },
  {
    value: 64,
    suffix: "%",
    label: "Say the funniest memories happen in private or group chats",
  },
  {
    value: 79,
    suffix: "%",
    label: "Of Next Gen Snapchatters share memes with best friends on the app",
  },
  {
    value: 50,
    suffix: "%",
    display: "1 in 2",
    label: "Like creating their own funny content with AR, filters, or lenses",
  },
] as const;

export const snapchatTabs = [
  { share: "1 in 2", action: "Sending funny things in Chat" },
  { share: "1 in 3", action: "Watching funny things friends post to Stories" },
  { share: "1 in 4", action: "Sharing funny things on Stories" },
  { share: "1 in 4", action: "Finding funny content on Spotlight" },
] as const;

export const humorPlaybook = [
  {
    step: "Read the room",
    detail: "Learn the language before joining. Every market adds flavor. Relevance beats reach.",
  },
  {
    step: "Build the joke",
    detail: "Context, structured randomness, irony, escalation. Mechanics matter more than copying a trend.",
  },
  {
    step: "Find the moment",
    detail: "Brands change a joke the second they join it. Contribute something new, or stay quiet.",
  },
  {
    step: "Design for sending",
    detail: "Chat, Stories, creators, AR. Make something people want to pass to a friend, not just watch.",
  },
] as const;
