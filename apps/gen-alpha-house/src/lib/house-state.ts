import { roomLenses } from "./house-data";
import type { RoomLens, RoomLensId, RoomObject, RoomObjectId } from "./house-types";

export function getRoomLens(id: string): RoomLens | undefined {
  return roomLenses.find((lens) => lens.id === id);
}

export function getRoomObject(lensId: RoomLensId, id: string): RoomObject | undefined {
  return getRoomLens(lensId)?.objects.find((item) => item.id === id);
}

export function countLinkedInsights(lensId: RoomLensId): number {
  return getRoomLens(lensId)?.objects.reduce((total, item) => total + item.insights.length, 0) ?? 0;
}

export function getAdjacentObject(lensId: RoomLensId, id: RoomObjectId, direction: -1 | 1): RoomObject {
  const objects = getRoomLens(lensId)?.objects ?? roomLenses[0].objects;
  const index = objects.findIndex((item) => item.id === id);
  const nextIndex = (index + direction + objects.length) % objects.length;
  return objects[nextIndex];
}
