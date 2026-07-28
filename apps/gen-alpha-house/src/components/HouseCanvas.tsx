import type { RoomObject, RoomObjectId } from "@/lib/house-types";

type HouseCanvasProps = {
  objects: RoomObject[];
  activeObjectId?: RoomObjectId;
  onActivate: (object: RoomObject) => void;
};

export default function HouseCanvas({ objects, activeObjectId, onActivate }: HouseCanvasProps) {
  const activeObject = objects.find((object) => object.id === activeObjectId);

  return (
    <div className="house-stage" data-active-object={activeObjectId ?? ""}>
      <div
        className="house-art-frame"
        style={{ "--mobile-focus-x": activeObject?.mobileFocus.x ?? 50 } as React.CSSProperties}
      >
        <img
          className="house-art"
          src="/gen-alpha-bedroom.jpg"
          alt="Illustrated Gen Alpha bedroom with a phone, television, homework desk, game console, backpack, toys, an open parent door, and a window onto a bike"
        />
        <div className="hotspot-layer" aria-label="Interactive room objects">
          {objects.map((object) => (
            <button
              className={`hotspot ${activeObjectId === object.id ? "is-activated" : ""}`}
              data-object-id={object.id}
              key={object.id}
              type="button"
              style={{
                "--hotspot-x": `${object.position.x}%`,
                "--hotspot-y": `${object.position.y}%`,
                "--hotspot-accent": object.accent
              } as React.CSSProperties}
              aria-label={object.label}
              onClick={() => onActivate(object)}
            >
              <span className="hotspot-pulse" aria-hidden="true" />
              <span className="hotspot-label">
                <span>{object.object}</span>
                <small>{object.insights.length} insights</small>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
