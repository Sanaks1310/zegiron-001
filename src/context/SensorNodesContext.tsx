import React, { createContext, useContext, useState, useCallback } from "react";
import { sensorNodes as initialNodes } from "@/data/mockData";

export type SensorCategory = "radar" | "eoir" | "ais" | "passiveRf";

export interface SensorEntry {
  id: string;
  label?: string;
  coords?: string;
  range?: string;
  vessels?: number;
  status: "operational" | "fault" | "monitoring";
}

type State = Record<SensorCategory, SensorEntry[]>;

interface Ctx {
  nodes: State;
  addSensor: (cat: SensorCategory, entry: SensorEntry) => void;
}

const SensorNodesContext = createContext<Ctx | null>(null);

export function SensorNodesProvider({ children }: { children: React.ReactNode }) {
  const [nodes, setNodes] = useState<State>(() => ({
    radar: [...initialNodes.radar],
    eoir: [...initialNodes.eoir],
    ais: [...initialNodes.ais],
    passiveRf: [...initialNodes.passiveRf],
  }));

  const addSensor = useCallback((cat: SensorCategory, entry: SensorEntry) => {
    setNodes(prev => ({ ...prev, [cat]: [...prev[cat], entry] }));
  }, []);

  return (
    <SensorNodesContext.Provider value={{ nodes, addSensor }}>
      {children}
    </SensorNodesContext.Provider>
  );
}

export function useSensorNodes() {
  const ctx = useContext(SensorNodesContext);
  if (!ctx) throw new Error("useSensorNodes must be used within SensorNodesProvider");
  return ctx;
}
