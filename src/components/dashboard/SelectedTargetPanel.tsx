import { useSelectedContact } from "@/context/SelectedContactContext";
import { PanelBox } from "./PanelBox";
import { AnimatePresence, motion } from "framer-motion";

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
    <PanelBox delay={0.1}>
      <AnimatePresence mode="wait">
        <motion.div
          key={selected.id}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.25 }}
          className="space-y-2.5"
        >
          <div className="flex items-center gap-2">
            <span className="text-primary glow-blue text-sm">+</span>
            <span className={`text-base font-display font-bold tracking-[0.15em] ${
              selected.type === "hostile" ? "text-destructive glow-magenta" :
              selected.type === "unknown" ? "text-warning glow-orange" :
              "text-primary glow-blue"
            }`}>
              {selected.label || selected.id}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[10px]">
            <span className="text-primary glow-blue font-display tracking-wider">TYPE</span>
            <span className="text-foreground uppercase">{selected.type}</span>
            <span className="text-primary glow-blue font-display tracking-wider">SPD</span>
            <span className="text-foreground">{selected.speed || "N/A"}</span>
            <span className="text-primary glow-blue font-display tracking-wider">POS</span>
            <span className="text-foreground">{selected.x}%, {selected.y}%</span>
          </div>

          <div className={`border rounded px-2.5 py-1.5 ${classColor[selected.type]}`}>
            <span className="text-[11px] font-bold tracking-[0.15em]">
              {classificationMap[selected.type]}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[10px]">
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
