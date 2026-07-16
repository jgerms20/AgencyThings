import { spaces as canonicalSpaces } from "./content/spaces";
import { sources as canonicalSources } from "./content/sources";
import type { Space } from "./content/spaces";
import type { Source } from "./content/types";

export type SpaceProfile = Space & {
  audience: string;
  howTheyUseIt: string;
  behavior: string;
  implication: string;
  sources: Array<{ id: string; label: string; url: string }>;
};

const sourceById = new Map(canonicalSources.map((source) => [source.id, source]));

export const spaces: SpaceProfile[] = canonicalSpaces.map((space) => ({
  ...space,
  audience: space.ageContext,
  howTheyUseIt: space.whyTheyGo,
  behavior: space.whatHappens,
  implication: space.strategyRelevance,
  sources: space.sourceIds
    .map((id) => sourceById.get(id))
    .filter((source): source is Source => Boolean(source))
    .map((source) => ({ id: source.id, label: source.organization, url: source.url })),
}));

export {
  spaceAgeBands,
  spaceCategories,
  spaceEnvironments,
} from "./content/spaces";
export type {
  Space,
  SpaceAgeBand,
  SpaceCategory,
  SpaceEnvironment,
  SpaceEvidenceStatus,
} from "./content/spaces";
