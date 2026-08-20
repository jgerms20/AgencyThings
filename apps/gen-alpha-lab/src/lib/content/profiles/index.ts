import { artistProfiles } from "./artists";
import { athleteProfiles } from "./athletes";
import { creatorProfiles } from "./creators";
import { ipProfiles } from "./ip";
import type { HumanProfile } from "./types";

export type { HumanProfile } from "./types";

const aliases: Record<string, string> = {
  minecraft: "minecraft-franchise",
  pokemon: "pokemon-franchise",
};

const profilesById = new Map(
  [...creatorProfiles, ...artistProfiles, ...athleteProfiles, ...ipProfiles].map((profile) => [profile.id, profile]),
);

export function getHumanProfile(id: string): HumanProfile | undefined {
  return profilesById.get(id) ?? profilesById.get(aliases[id] ?? id);
}
