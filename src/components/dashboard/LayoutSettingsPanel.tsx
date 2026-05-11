import { Settings, GripVertical, Eye, EyeOff } from "lucide-react";
import { useDashboardLayout } from "@/context/DashboardLayoutContext";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { useState, useRef } from "react";
import { getPanelMeta } from "./panelIcons";

export function LayoutSettingsPanel() {
  const { components, toggleVisibility, getSidebarPanels, reorderSidebar } = useDashboardLayout();
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const dragOverIdx = useRef<number | null>(null);

  const groups = [
    { label: "LAYOUT", items: components.filter(c => c.group === "layout") },
    { label: "MAP OVERLAYS", items: components.filter(c => c.group === "map-overlay") },
    { label: "FLOATING PANELS", items: getSidebarPanels() },
  ];

  const handleDragStart = (index: number) => setDragIdx(index);
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    dragOverIdx.current = index;
  };
  const handleDrop = () => {
    if (dragIdx !== null && dragOverIdx.current !== null && dragIdx !== dragOverIdx.current) {
      reorderSidebar(dragIdx, dragOverIdx.current);
    }
    setDragIdx(null);
    dragOverIdx.current = null;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="fixed top-2 right-2 z-50 p-1.5 rounded-md bg-card/90 border border-primary/40 backdrop-blur-sm hover:bg-primary/20 hover:border-primary transition-all shadow-lg shadow-primary/10"
          title="Layout Settings"
        >
          <Settings size={14} className="text-primary drop-shadow-[0_0_4px_hsl(var(--primary))]" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        side="left"
        align="start"
        className="w-72 p-0 bg-gradient-to-br from-card via-card/95 to-background/95 backdrop-blur-xl border border-primary/30 shadow-2xl shadow-black/60 ring-1 ring-white/5"
      >
        {/* Header */}
        <div className="px-3 py-2 border-b border-primary/30 bg-gradient-to-r from-primary/15 to-transparent flex items-center gap-2">
          <Settings size={11} className="text-primary" />
          <span className="text-[10px] font-bold tracking-[0.2em] text-primary font-display drop-shadow-[0_0_4px_hsl(var(--primary)/0.6)]">
            LAYOUT SETTINGS
          </span>
        </div>

        <div className="max-h-[420px] overflow-y-auto p-2.5 space-y-3 custom-scrollbar">
          {groups.map((group) => (
            <div key={group.label}>
              <div className="flex items-center gap-1.5 mb-1.5 px-1">
                <div className="h-px flex-1 bg-gradient-to-r from-primary/40 to-transparent" />
                <span className="text-[8px] font-bold tracking-[0.2em] text-primary/80">
                  {group.label}
                </span>
                <div className="h-px flex-1 bg-gradient-to-l from-primary/40 to-transparent" />
              </div>
              <div className="space-y-1">
                {group.items.map((item, idx) => {
                  const isSidebar = item.group === "sidebar";
                  const meta = getPanelMeta(item.id);
                  const Icon = meta.icon;
                  return (
                    <div
                      key={item.id}
                      draggable={isSidebar}
                      onDragStart={() => isSidebar && handleDragStart(idx)}
                      onDragOver={(e) => isSidebar && handleDragOver(e, idx)}
                      onDrop={isSidebar ? handleDrop : undefined}
                      className={`group flex items-center gap-2 px-2 py-1.5 rounded-md border transition-all cursor-pointer ${
                        item.visible
                          ? `${meta.ring} bg-primary/10 hover:bg-primary/20`
                          : "border-border/50 bg-muted/20 hover:bg-muted/40"
                      } ${dragIdx === idx && isSidebar ? "opacity-40" : ""}`}
                      onClick={() => toggleVisibility(item.id)}
                    >
                      {isSidebar && (
                        <GripVertical size={10} className="text-muted-foreground/60 group-hover:text-primary cursor-grab shrink-0" />
                      )}
                      {/* Logo chip */}
                      <span className={`flex items-center justify-center w-5 h-5 rounded border ${meta.ring} bg-background/70 shrink-0`}>
                        <Icon size={11} className={`${meta.color} ${item.visible ? meta.glow : "opacity-60"}`} strokeWidth={2.2} />
                      </span>
                      <span className={`text-[10px] flex-1 select-none truncate ${item.visible ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                        {item.label}
                      </span>
                      {item.visible
                        ? <Eye size={11} className={meta.color} />
                        : <EyeOff size={11} className="text-muted-foreground/50" />}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="px-3 py-1.5 border-t border-primary/20 bg-background/40 flex items-center justify-between">
          <span className="text-[8px] tracking-[0.15em] text-muted-foreground/70">CLICK TO TOGGLE · DRAG TO REORDER</span>
        </div>
      </PopoverContent>
    </Popover>
  );
}
