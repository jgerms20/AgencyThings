"use client";

import { ArrowUpRight, ScanSearch, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { roomObjects } from "@/lib/house-data";
import { countLinkedInsights } from "@/lib/house-state";
import type { RoomObject, ThemeMode } from "@/lib/house-types";
import HouseCanvas from "./HouseCanvas";
import InsightDrawer from "./InsightDrawer";
import ObjectIndex from "./ObjectIndex";

const enteredKey = "gen-alpha-house-entered";

export default function HouseExperience() {
  const [entered, setEntered] = useState(false);
  const [selectedObject, setSelectedObject] = useState<RoomObject | null>(null);
  const [theme, setTheme] = useState<ThemeMode>("night");

  useEffect(() => {
    if (window.sessionStorage.getItem(enteredKey) === "true") setEntered(true);
    if (window.matchMedia?.("(prefers-color-scheme: light)").matches) setTheme("day");
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setSelectedObject(null);
    }

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, []);

  function enterRoom() {
    window.sessionStorage.setItem(enteredKey, "true");
    setEntered(true);
  }

  return (
    <main className={`house-app ${selectedObject ? "has-open-drawer" : ""}`}>
      {!entered && (
        <section className="arrival" aria-labelledby="arrival-title">
          <div className="arrival-scrim" />
          <div className="arrival-content">
            <span className="arrival-mark" aria-hidden="true">GA</span>
            <h1 id="arrival-title">Come inside.</h1>
            <p>One Gen Alpha bedroom. Eight familiar objects. Thirty-two sourced connections to the Intelligence Lab.</p>
            <div className="arrival-actions">
              <button className="enter-button" type="button" onClick={enterRoom}>
                Knock to enter
                <ArrowUpRight aria-hidden="true" size={18} />
              </button>
              <button className="skip-button" type="button" onClick={enterRoom}>
                Skip to the room
              </button>
            </div>
          </div>
        </section>
      )}

      <header className="house-header">
        <a className="house-brand" href="#house-canvas" aria-label="Gen Alpha House home">
          <span className="brand-monogram">GA</span>
          <span>Gen Alpha House</span>
        </a>
        <div className="header-actions">
          <a className="map-link" href="#object-index">
            <ScanSearch aria-hidden="true" size={17} />
            Object guide
          </a>
          <a className="lab-link" href="https://agencythings-gen-alpha.vercel.app">
            Open the Intelligence Lab
            <ArrowUpRight aria-hidden="true" size={17} />
          </a>
          <button
            className="theme-toggle"
            type="button"
            aria-label={`Switch to ${theme === "night" ? "day" : "night"} mode`}
            onClick={() => setTheme((current) => current === "night" ? "day" : "night")}
          >
            {theme === "night" ? <Moon aria-hidden="true" size={16} /> : <Sun aria-hidden="true" size={16} />}
            <span>{theme === "night" ? "Night" : "Day"}</span>
          </button>
        </div>
      </header>

      <section className="house-experience" id="house-canvas" role="region" aria-label="Interactive Gen Alpha bedroom">
        <div className="house-intro-line">
          <p>Start with the objects. Each one opens a set of sourced insights.</p>
          <span>{roomObjects.length} objects / {countLinkedInsights()} insight connections</span>
        </div>
        <HouseCanvas
          objects={roomObjects}
          activeObjectId={selectedObject?.id}
          onActivate={setSelectedObject}
        />
        <ObjectIndex objects={roomObjects} onActivate={setSelectedObject} />
      </section>

      {selectedObject && (
        <>
          <button className="drawer-backdrop" type="button" aria-label="Dismiss insight" onClick={() => setSelectedObject(null)} />
          <InsightDrawer object={selectedObject} onClose={() => setSelectedObject(null)} />
        </>
      )}
    </main>
  );
}
