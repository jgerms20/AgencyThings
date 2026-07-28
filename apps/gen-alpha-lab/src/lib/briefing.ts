export type BriefingSlide = {
  number: string;
  title: string;
  headline: string;
  explanation: string;
  sayIt: string;
  confidence: "High" | "Medium";
  evidence: string;
  insightId: string;
  sourceNames: string[];
};

export const briefingSlides: BriefingSlide[] = [
  { number: "01", title: "The real unit is the household", headline: "Personal devices arrive before personal independence.", explanation: "Access, privacy, payments, bedtime, content, and conversation still run through adults even when the screen feels private.", sayIt: "Gen Alpha’s media life is personal, but it is not independent.", confidence: "High", evidence: "Direct child/family research + policy context", insightId: "time-device-access", sourceNames: ["Common Sense Media", "Pew Research Center"] },
  { number: "02", title: "Friendship is cross-platform", headline: "Play is social infrastructure, not an escape from social life.", explanation: "The same relationships can move between a game, voice chat, school, clips, a bike ride, and back again.", sayIt: "For Gen Alpha, the game can be a place where friendship happens.", confidence: "High", evidence: "Representative teen proxy + longitudinal child research", insightId: "play-social-infrastructure", sourceNames: ["Pew Research Center", "Ofcom"] },
  { number: "03", title: "The TV became the everything screen", headline: "Video is simultaneously entertainment, search, fandom, music, sport, and family ritual.", explanation: "The largest screen in the room shows how creator media and traditional IP now overlap inside household viewing.", sayIt: "Do not plan for channels; plan for a fluid video ecosystem.", confidence: "High", evidence: "National child census + qualitative media diaries", insightId: "media-video-default", sourceNames: ["Common Sense Media", "Ofcom"] },
  { number: "04", title: "AI joined the learning stack", headline: "AI is already one tool among search, video, teachers, family, and peers.", explanation: "The strategic question is no longer whether children encounter conversational AI, but how they verify, disclose, and use it with support.", sayIt: "Teach judgment around AI, not just access to it.", confidence: "High", evidence: "National youth study + systematic education review", insightId: "learning-ai-homework", sourceNames: ["Common Sense Media", "Discover Education"] },
  { number: "05", title: "Consumption becomes creation", headline: "Play, avatars, clips, stories, and making form one identity workshop.", explanation: "Children do not only watch culture; they remix formats, rehearse worlds, and signal affiliation across physical and digital objects.", sayIt: "The strongest experiences give children a meaningful role, not just a message.", confidence: "Medium", evidence: "National creation-gaming study + platform signal", insightId: "learning-remix", sourceNames: ["Walton Family Foundation", "Roblox"] },
  { number: "06", title: "Online and offline coexist", headline: "The bike outside the window is part of the same social map as the console.", explanation: "Sport, neighborhood play, school, and digital coordination can reinforce one another; screen time alone hides the quality and context of the day.", sayIt: "Study the whole routine, not a false online-versus-offline contest.", confidence: "Medium", evidence: "Youth participation trend + longitudinal child research", insightId: "play-offline-rebound", sourceNames: ["Aspen Institute Project Play", "Ofcom"] },
];

export const validityLadder = [
  { level: "01", name: "Direct child research", use: "Best anchor when the age range, sample, method, geography, and fieldwork are visible." },
  { level: "02", name: "Peer-reviewed synthesis", use: "Best for evaluating patterns across studies; still check included ages, measures, and causal limits." },
  { level: "03", name: "Teen or adjacent-age proxy", use: "Useful directional context for older Alpha; never silently generalized to younger children." },
  { level: "04", name: "Industry or platform signal", use: "Useful for emerging behavior and first-party scale; interpreted with commercial and platform bias visible." },
  { level: "05", name: "Editorial interpretation", use: "The Lab’s synthesis layer. It must trace back to evidence and remain clearly labeled as interpretation." },
];
