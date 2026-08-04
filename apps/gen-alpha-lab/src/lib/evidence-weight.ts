export const validityLadder = [
  { level: "01", name: "Direct child research", use: "Best anchor when the age range, sample, method, geography, and fieldwork are visible." },
  { level: "02", name: "Peer-reviewed synthesis", use: "Best for evaluating patterns across studies; still check included ages, measures, and causal limits." },
  { level: "03", name: "Teen or adjacent-age proxy", use: "Useful directional context for older Alpha; never silently generalized to younger children." },
  { level: "04", name: "Industry or platform signal", use: "Useful for emerging behavior and first-party scale; interpreted with commercial and platform bias visible." },
  { level: "05", name: "Editorial interpretation", use: "The Lab’s synthesis layer. It must trace back to evidence and remain clearly labeled as interpretation." },
] as const;
