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
}

type State = Record<SensorCategory, SensorEntry[]>;
type VisibleState = Record<SensorCategory, boolean>;

export interface SelectedSensor extends SensorEntry {
  category: SensorCategory;
}

interface Ctx {
  nodes: State;
  addSensor: (cat: SensorCategory, entry: SensorEntry) => void;
  visible: VisibleState;
  toggleCategory: (cat: SensorCategory) => void;
  selectedSensor: SelectedSensor | null;
  setSelectedSensor: (s: SelectedSensor | null) => void;
}

const SensorNodesContext = createContext<Ctx | null>(null);

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

  const [selectedSensor, setSelectedSensor] = useState<SelectedSensor | null>(null);

  const addSensor = useCallback((cat: SensorCategory, entry: SensorEntry) => {
    setNodes(prev => ({ ...prev, [cat]: [...prev[cat], entry] }));
  }, []);

  const toggleCategory = useCallback((cat: SensorCategory) => {
    setVisible(prev => ({ ...prev, [cat]: !prev[cat] }));
  }, []);

  return (
    <SensorNodesContext.Provider value={{ nodes, addSensor, visible, toggleCategory, selectedSensor, setSelectedSensor }}>
      {children}
    </SensorNodesContext.Provider>
  );
}

export function useSensorNodes() {
  const ctx = useContext(SensorNodesContext);
  if (!ctx) throw new Error("useSensorNodes must be used within SensorNodesProvider");
  return ctx;
}
