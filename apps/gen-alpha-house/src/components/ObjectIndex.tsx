import type { RoomObject } from "@/lib/house-types";

type ObjectIndexProps = {
  objects: RoomObject[];
  onActivate: (object: RoomObject) => void;
};

export default function ObjectIndex({ objects, onActivate }: ObjectIndexProps) {
  return (
    <nav className="object-index" id="object-index" aria-label="Room object index">
      {objects.map((object, index) => (
        <button
          key={object.id}
          type="button"
          aria-label={`Explore ${object.object}`}
          onClick={() => onActivate(object)}
        >
          <span>{String(index + 1).padStart(2, "0")}</span>
          <strong>{object.object}</strong>
          <small>{object.insights.length} linked insights</small>
        </button>
      ))}
    </nav>
  );
}
