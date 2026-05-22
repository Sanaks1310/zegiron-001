import React, { createContext, useContext, useState, useCallback } from "react";
import { sensorNodes as initialNodes } from "@/data/mockData";

export type SensorCategory = "radar" | "eoir" | "ais" | "passiveRf";

export type SensorAffiliation = "friendly" | "unfriendly";

export interface SensorEntry {
  id: string;
  label?: string;
  coords?: string;
  range?: string;
  vessels?: number;
  status: "operational" | "fault" | "monitoring";
  affiliation?: SensorAffiliation;
  /** AIS only: from/to coordinate strings to animate the vessel between */
  route?: { from: string; to: string };
}

type State = Record<SensorCategory, SensorEntry[]>;
type VisibleState = Record<SensorCategory, boolean>;

export interface SelectedSensor extends SensorEntry {
  category: SensorCategory;
}

export interface FeedEvent {
  time: string;
  text: string;
  source: string;
  severity: "low" | "medium" | "high";
}

interface Ctx {
  nodes: State;
  addSensor: (cat: SensorCategory, entry: SensorEntry) => void;
  visible: VisibleState;
  toggleCategory: (cat: SensorCategory) => void;
  selectedSensor: SelectedSensor | null;
  setSelectedSensor: (s: SelectedSensor | null) => void;
  events: FeedEvent[];
}

const SensorNodesContext = createContext<Ctx | null>(null);

function nowTs() {
  const d = new Date();
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mm = String(d.getUTCMinutes()).padStart(2, "0");
  const ss = String(d.getUTCSeconds()).padStart(2, "0");
  return `${hh}:${mm}:${ss}Z`;
}

const CAT_LABEL: Record<SensorCategory, string> = {
  radar: "RADAR", eoir: "EO/IR", ais: "AIS", passiveRf: "PASSIVE-RF",
};

export function SensorNodesProvider({ children }: { children: React.ReactNode }) {
  const [nodes, setNodes] = useState<State>(() => ({
    radar: [...initialNodes.radar],
    eoir: [...initialNodes.eoir],
    ais: [...initialNodes.ais],
    passiveRf: [...initialNodes.passiveRf],
  }));

  const [visible, setVisible] = useState<VisibleState>({
    radar: true, eoir: true, ais: true, passiveRf: true,
  });

  const [selectedSensor, setSelectedSensorState] = useState<SelectedSensor | null>(null);
  const [events, setEvents] = useState<FeedEvent[]>([]);

  const pushEvent = useCallback((e: Omit<FeedEvent, "time"> & { time?: string }) => {
    setEvents(prev => [{ time: e.time ?? nowTs(), text: e.text, source: e.source, severity: e.severity }, ...prev].slice(0, 30));
  }, []);

  const addSensor = useCallback((cat: SensorCategory, entry: SensorEntry) => {
    setNodes(prev => ({ ...prev, [cat]: [...prev[cat], entry] }));
    const hostile = entry.affiliation === "unfriendly";
    pushEvent({
      text: `New ${CAT_LABEL[cat]} node ${entry.id}${entry.label ? ` (${entry.label})` : ""} registered${entry.coords ? ` at ${entry.coords}` : ""}. Affiliation: ${hostile ? "HOSTILE" : "FRIENDLY"}.`,
      source: `SYSTEM · ${entry.id}`,
      severity: hostile ? "high" : "low",
    });
  }, [pushEvent]);

  const toggleCategory = useCallback((cat: SensorCategory) => {
    setVisible(prev => {
      const next = !prev[cat];
      pushEvent({
        text: `${CAT_LABEL[cat]} layer ${next ? "ENABLED" : "DISABLED"} on tactical display.`,
        source: `OPERATOR · LAYER-CTL`,
        severity: "low",
      });
      return { ...prev, [cat]: next };
    });
  }, [pushEvent]);

  const setSelectedSensor = useCallback((s: SelectedSensor | null) => {
    setSelectedSensorState(s);
    if (s) {
      pushEvent({
        text: `Operator focus on ${s.id}${s.label ? ` · ${s.label}` : ""}. ${s.coords ?? ""}`.trim(),
        source: `TARGETING · ${CAT_LABEL[s.category]}`,
        severity: s.affiliation === "unfriendly" ? "high" : "medium",
      });
    }
  }, [pushEvent]);

  return (
    <SensorNodesContext.Provider value={{ nodes, addSensor, visible, toggleCategory, selectedSensor, setSelectedSensor, events }}>
      {children}
    </SensorNodesContext.Provider>
  );
}

export function useSensorNodes() {
  const ctx = useContext(SensorNodesContext);
  if (!ctx) throw new Error("useSensorNodes must be used within SensorNodesProvider");
  return ctx;
}
