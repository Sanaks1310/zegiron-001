import React, { createContext, useContext, useState, useCallback } from "react";

export interface DashboardComponent {
  id: string;
  label: string;
  group: "layout" | "sidebar" | "map-overlay";
  visible: boolean;
  order: number;
}

const defaultComponents: DashboardComponent[] = [
  // Layout
  { id: "top-header", label: "Top Header", group: "layout", visible: true, order: 0 },
  { id: "bottom-status", label: "Bottom Status Bar", group: "layout", visible: true, order: 1 },
  { id: "spectrogram", label: "Spectrogram", group: "layout", visible: true, order: 2 },
  { id: "radar-map", label: "Radar Map", group: "layout", visible: true, order: 3 },

  // Map overlays
  { id: "flight-trails", label: "Flight Trails", group: "map-overlay", visible: true, order: 0 },
  { id: "threat-zones", label: "Threat Zones", group: "map-overlay", visible: true, order: 1 },

  // Sidebar panels
  { id: "sensor-nodes", label: "Sensor Nodes", group: "sidebar", visible: true, order: 0 },
  { id: "selected-target", label: "Selected Target", group: "sidebar", visible: true, order: 1 },
  { id: "sensor-fusion", label: "Sensor Fusion", group: "sidebar", visible: true, order: 2 },
  { id: "intel-feed", label: "Intelligence Feed", group: "sidebar", visible: true, order: 3 },
];

interface DashboardLayoutContextType {
  components: DashboardComponent[];
  toggleVisibility: (id: string) => void;
  isVisible: (id: string) => boolean;
  reorderSidebar: (fromIndex: number, toIndex: number) => void;
  getSidebarPanels: () => DashboardComponent[];
}

const DashboardLayoutContext = createContext<DashboardLayoutContextType | null>(null);

export function DashboardLayoutProvider({ children }: { children: React.ReactNode }) {
  const [components, setComponents] = useState<DashboardComponent[]>(defaultComponents);

  const toggleVisibility = useCallback((id: string) => {
    setComponents(prev => prev.map(c => c.id === id ? { ...c, visible: !c.visible } : c));
  }, []);

  const isVisible = useCallback((id: string) => {
    return components.find(c => c.id === id)?.visible ?? true;
  }, [components]);

  const reorderSidebar = useCallback((fromIndex: number, toIndex: number) => {
    setComponents(prev => {
      const next = [...prev];
      const sidebarItems = next.filter(c => c.group === "sidebar").sort((a, b) => a.order - b.order);
      const [moved] = sidebarItems.splice(fromIndex, 1);
      sidebarItems.splice(toIndex, 0, moved);
      sidebarItems.forEach((item, i) => {
        const idx = next.findIndex(c => c.id === item.id);
        if (idx !== -1) next[idx] = { ...next[idx], order: i };
      });
      return next;
    });
  }, []);

  const getSidebarPanels = useCallback(() => {
    return components.filter(c => c.group === "sidebar").sort((a, b) => a.order - b.order);
  }, [components]);

  return (
    <DashboardLayoutContext.Provider value={{ components, toggleVisibility, isVisible, reorderSidebar, getSidebarPanels }}>
      {children}
    </DashboardLayoutContext.Provider>
  );
}

export function useDashboardLayout() {
  const ctx = useContext(DashboardLayoutContext);
  if (!ctx) throw new Error("useDashboardLayout must be used within DashboardLayoutProvider");
  return ctx;
}
