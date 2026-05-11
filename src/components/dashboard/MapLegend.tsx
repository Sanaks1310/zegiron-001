import { useDashboardLayout } from "@/context/DashboardLayoutContext";
import { getPanelMeta } from "./panelIcons";
import { Layers } from "lucide-react";

export function MapLegend() {
  const { getSidebarPanels } = useDashboardLayout();
  const visible = getSidebarPanels().filter(p => p.visible);

  if (visible.length === 0) return null;

  return (
    <div className="absolute top-2 left-2 z-[5] pointer-events-auto">
      <div className="rounded-md border border-primary/40 bg-gradient-to-br from-card/95 to-background/85 backdrop-blur-md shadow-lg shadow-black/40 ring-1 ring-white/5 overflow-hidden min-w-[140px]">
        <div className="flex items-center gap-1.5 px-2 py-1 border-b border-primary/30 bg-gradient-to-r from-primary/15 to-transparent">
          <Layers size={9} className="text-primary" />
          <span className="text-[9px] font-bold tracking-[0.18em] text-primary font-display">
            ACTIVE PANELS
          </span>
        </div>
        <div className="p-1.5 space-y-0.5">
          {visible.map(p => {
            const meta = getPanelMeta(p.id);
            const Icon = meta.icon;
            return (
              <div
                key={p.id}
                className={`flex items-center gap-1.5 px-1.5 py-0.5 rounded border ${meta.ring} bg-background/40`}
                title={p.label}
              >
                <span className={`flex items-center justify-center w-4 h-4 rounded-sm bg-background/70 border ${meta.ring}`}>
                  <Icon size={9} className={`${meta.color} ${meta.glow}`} strokeWidth={2.2} />
                </span>
                <span className={`text-[9px] ${meta.color} font-medium truncate`}>
                  {p.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
