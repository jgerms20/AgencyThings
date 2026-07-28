import type { RoomLens, RoomObject, RoomObjectId } from "@/lib/house-types";

type HouseCanvasProps = {
  lens: RoomLens;
  activeObjectId?: RoomObjectId;
  onActivate: (object: RoomObject) => void;
};

export default function HouseCanvas({ lens, activeObjectId, onActivate }: HouseCanvasProps) {
  const activeObject = lens.objects.find((object) => object.id === activeObjectId);

  return (
    <div className="house-stage" data-active-object={activeObjectId ?? ""} data-room-lens={lens.id}>
      <div
        className="house-art-frame"
        style={{ "--mobile-focus-x": activeObject?.mobileFocus.x ?? 50 } as React.CSSProperties}
      >
        <img className="house-art" src={lens.imageSrc} alt={lens.imageAlt} />
        <div className="hotspot-layer" aria-label={`Interactive ${lens.label.toLowerCase()} objects`}>
          {lens.objects.map((object, index) => {
            const number = String(index + 1).padStart(2, "0");
            return (
              <button
                className={`hotspot ${activeObjectId === object.id ? "is-activated" : ""}`}
                data-hotspot-number={number}
                data-object-id={object.id}
                key={object.id}
                type="button"
                style={{
                  "--hotspot-x": `${object.position.x}%`,
                  "--hotspot-y": `${object.position.y}%`,
                  "--hotspot-accent": object.accent,
                } as React.CSSProperties}
                aria-label={object.label}
                onClick={() => onActivate(object)}
              >
                <span className="hotspot-pulse" aria-hidden="true"><span>{number}</span></span>
                <span className="hotspot-label">
                  <span>{object.object}</span>
                  <small>{object.insights.length} insights</small>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
