"use client";

import { ArrowUpRight, ScanSearch } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import { roomLenses } from "@/lib/house-data";
import { countLinkedInsights } from "@/lib/house-state";
import type { RoomLensId, RoomObject } from "@/lib/house-types";
import HouseCanvas from "./HouseCanvas";
import InsightDrawer from "./InsightDrawer";
import ObjectIndex from "./ObjectIndex";

const roomKey = "gen-alpha-house-room-lens";

export default function HouseExperience() {
  const [activeLensId, setActiveLensId] = useState<RoomLensId>("boys");
  const [selectedObject, setSelectedObject] = useState<RoomObject | null>(null);
  const activeLens = roomLenses.find((lens) => lens.id === activeLensId) ?? roomLenses[0];

  useEffect(() => {
    const savedLens = window.sessionStorage.getItem(roomKey);
    if (savedLens === "boys" || savedLens === "girls") setActiveLensId(savedLens);
  }, []);

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setSelectedObject(null);
    }
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, []);

  function switchLens(lensId: RoomLensId) {
    window.sessionStorage.setItem(roomKey, lensId);
    setActiveLensId(lensId);
    setSelectedObject(null);
  }

  return (
    <>
      <SiteHeader active="house" />
      <main className={`house-app ${selectedObject ? "has-open-drawer" : ""}`} data-room-lens={activeLens.id}>
        <nav className="house-header" aria-label="House map">
          <div className="house-brand"><span className="brand-monogram" aria-hidden="true">GA</span><h1>The House</h1></div>
          <div className="header-actions">
            <a className="map-link" href="#object-index"><ScanSearch aria-hidden="true" size={17} />Object guide</a>
            <Link className="lab-link" href="/insights">Research findings <ArrowUpRight aria-hidden="true" size={17} /></Link>
          </div>
        </nav>

        <section className="house-experience" id="house-canvas" role="region" aria-label={`Interactive ${activeLens.label.toLowerCase()}`}>
          <div className="room-lens-bar">
            <div className="room-lens-tabs" role="tablist" aria-label="Room lens">
              {roomLenses.map((lens) => (
                <button aria-selected={activeLens.id === lens.id} key={lens.id} onClick={() => switchLens(lens.id)} role="tab" type="button">
                  {lens.label}
                </button>
              ))}
            </div>
            <div className="room-lens-copy"><strong>{activeLens.title}</strong><p>{activeLens.framing}</p></div>
            <span>{activeLens.objects.length} objects / {countLinkedInsights(activeLens.id)} insight connections</span>
          </div>
          <aside className="room-method-note">
            <p><strong>These are composite rooms, not a rulebook.</strong> They turn patterns into objects; they do not describe every boy, every girl, or every gender-diverse child.</p>
            <Link href="/gender">Read the gender evidence notes <ArrowUpRight aria-hidden="true" size={15} /></Link>
          </aside>
          <HouseCanvas lens={activeLens} activeObjectId={selectedObject?.id} onActivate={setSelectedObject} />
          <ObjectIndex label={activeLens.label} objects={activeLens.objects} onActivate={setSelectedObject} />
        </section>

        {selectedObject && (
          <>
            <button className="drawer-backdrop" type="button" aria-label="Dismiss insight" onClick={() => setSelectedObject(null)} />
            <InsightDrawer object={selectedObject} onClose={() => setSelectedObject(null)} />
          </>
        )}
      </main>
    </>
  );
}
