import { useSelectedContact } from "@/context/SelectedContactContext";
import { PanelBox } from "./PanelBox";
import { AnimatePresence, motion } from "framer-motion";
import { Crosshair } from "lucide-react";

const classificationMap: Record<string, string> = {
  hostile: "FAST CRAFT",
  unknown: "UNIDENTIFIED",
  friendly: "ALLIED VESSEL",
};

const classColor: Record<string, string> = {
  hostile: "text-destructive glow-magenta border-destructive/40 box-glow-magenta",
  unknown: "text-warning glow-orange border-warning/40",
  friendly: "text-primary glow-blue border-primary/40 box-glow-blue",
};

export function SelectedTargetPanel() {
  const { selected } = useSelectedContact();

  return (
    <PanelBox title="SELECTED TARGET" icon={<Crosshair size={12} />} delay={0.1}>
      <AnimatePresence mode="wait">
        <motion.div
          key={selected.id}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
          className="space-y-2"
        >
          <div className="flex items-center gap-2">
            <span className={`text-sm font-display font-bold tracking-[0.15em] ${
              selected.type === "hostile" ? "text-destructive glow-magenta" :
              selected.type === "unknown" ? "text-warning glow-orange" :
              "text-primary glow-blue"
            }`}>
              {selected.label || selected.id}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[9px]">
            <span className="text-primary/80 font-display tracking-wider">TYPE</span>
            <span className="text-foreground uppercase">{selected.type}</span>
            <span className="text-primary/80 font-display tracking-wider">SPD</span>
            <span className="text-foreground">{selected.speed || "N/A"}</span>
            <span className="text-primary/80 font-display tracking-wider">POS</span>
            <span className="text-foreground">{selected.x}%, {selected.y}%</span>
          </div>

          <div className={`border rounded px-2 py-1 ${classColor[selected.type]}`}>
            <span className="text-[10px] font-bold tracking-[0.15em]">
              {classificationMap[selected.type]}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[9px]">
            <span className="text-muted-foreground">ID</span>
            <span className="text-foreground">{selected.id}</span>
            <span className="text-muted-foreground">GRID</span>
            <span className="text-foreground">{selected.x}·{selected.y}</span>
          </div>
        </motion.div>
      </AnimatePresence>
    </PanelBox>
  );
}
