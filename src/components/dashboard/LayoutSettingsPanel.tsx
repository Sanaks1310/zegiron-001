import { Settings, GripVertical } from "lucide-react";
import { useDashboardLayout } from "@/context/DashboardLayoutContext";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { useState, useRef } from "react";

export function LayoutSettingsPanel() {
  const { components, toggleVisibility, getSidebarPanels, reorderSidebar } = useDashboardLayout();
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const dragOverIdx = useRef<number | null>(null);

  const groups = [
    { label: "LAYOUT", items: components.filter(c => c.group === "layout") },
    { label: "MAP OVERLAYS", items: components.filter(c => c.group === "map-overlay") },
    { label: "SIDEBAR PANELS", items: getSidebarPanels() },
  ];

  const handleDragStart = (index: number) => {
    setDragIdx(index);
  };

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
          className="fixed top-2 right-2 z-50 p-1.5 rounded bg-card/80 border border-border backdrop-blur-sm hover:bg-accent/30 transition-colors"
          title="Layout Settings"
        >
          <Settings size={14} className="text-primary" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        side="left"
        align="start"
        className="w-56 p-0 bg-card/95 backdrop-blur-md border-border"
      >
        <div className="px-3 py-2 border-b border-border">
          <span className="text-[10px] font-bold tracking-[0.15em] text-primary font-display">
            LAYOUT SETTINGS
          </span>
        </div>
        <div className="max-h-80 overflow-y-auto p-2 space-y-3">
          {groups.map((group) => (
            <div key={group.label}>
              <span className="text-[9px] font-bold tracking-[0.12em] text-muted-foreground mb-1 block">
                {group.label}
              </span>
              <div className="space-y-0.5">
                {group.items.map((item, idx) => {
                  const isSidebar = item.group === "sidebar";
                  return (
                    <div
                      key={item.id}
                      draggable={isSidebar}
                      onDragStart={() => isSidebar && handleDragStart(idx)}
                      onDragOver={(e) => isSidebar && handleDragOver(e, idx)}
                      onDrop={isSidebar ? handleDrop : undefined}
                      className={`flex items-center gap-2 px-2 py-1 rounded hover:bg-accent/20 transition-colors cursor-pointer ${
                        dragIdx === idx && isSidebar ? "opacity-50" : ""
                      }`}
                      onClick={() => toggleVisibility(item.id)}
                    >
                      {isSidebar && (
                        <GripVertical size={10} className="text-muted-foreground cursor-grab shrink-0" />
                      )}
                      <div
                        className={`w-3 h-3 rounded-sm border shrink-0 flex items-center justify-center transition-colors ${
                          item.visible
                            ? "bg-primary border-primary"
                            : "border-muted-foreground bg-transparent"
                        }`}
                      >
                        {item.visible && (
                          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                            <path d="M1 4L3 6L7 2" stroke="hsl(var(--primary-foreground))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <span className="text-[10px] text-foreground select-none">{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
