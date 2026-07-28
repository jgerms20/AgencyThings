import { roomObjects } from "./house-data";
import type { RoomObject, RoomObjectId } from "./house-types";

export function getRoomObject(id: string): RoomObject | undefined {
  return roomObjects.find((item) => item.id === id);
}

export function countLinkedInsights(): number {
  return roomObjects.reduce((total, item) => total + item.insights.length, 0);
}

export function getAdjacentObject(id: RoomObjectId, direction: -1 | 1): RoomObject {
  const index = roomObjects.findIndex((item) => item.id === id);
  const nextIndex = (index + direction + roomObjects.length) % roomObjects.length;
  return roomObjects[nextIndex];
}
