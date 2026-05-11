import {
  Radio,
  Camera,
  Crosshair,
  Radar,
  Network,
  FileText,
  Activity,
  LucideIcon,
} from "lucide-react";

export interface PanelMeta {
  icon: LucideIcon;
  color: string; // tailwind text color class
  ring: string;  // tailwind ring/border class
  glow: string;  // tailwind drop-shadow class
}

export const PANEL_META: Record<string, PanelMeta> = {
  "mode-badge": {
    icon: Activity,
    color: "text-primary",
    ring: "border-primary/60",
    glow: "drop-shadow-[0_0_6px_hsl(217_95%_58%/0.7)]",
  },
  "eoir-thumbnail": {
    icon: Camera,
    color: "text-success",
    ring: "border-success/60",
    glow: "drop-shadow-[0_0_6px_hsl(145_70%_50%/0.7)]",
  },
  "sensor-nodes": {
    icon: Radio,
    color: "text-warning",
    ring: "border-warning/60",
    glow: "drop-shadow-[0_0_6px_hsl(32_95%_55%/0.7)]",
  },
  "selected-target": {
    icon: Crosshair,
    color: "text-destructive",
    ring: "border-destructive/60",
    glow: "drop-shadow-[0_0_6px_hsl(338_90%_56%/0.7)]",
  },
  "sensor-fusion": {
    icon: Network,
    color: "text-accent",
    ring: "border-accent/60",
    glow: "drop-shadow-[0_0_6px_hsl(280_80%_60%/0.7)]",
  },
  "intel-feed": {
    icon: FileText,
    color: "text-primary",
    ring: "border-primary/60",
    glow: "drop-shadow-[0_0_6px_hsl(217_95%_58%/0.7)]",
  },
};

export const DEFAULT_PANEL_META: PanelMeta = {
  icon: Radar,
  color: "text-muted-foreground",
  ring: "border-border",
  glow: "",
};

export function getPanelMeta(id: string): PanelMeta {
  return PANEL_META[id] || DEFAULT_PANEL_META;
}
