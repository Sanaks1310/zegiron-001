import { useSelectedContact } from "@/context/SelectedContactContext";
import { useSensorNodes, SensorCategory } from "@/context/SensorNodesContext";
import { PanelBox } from "./PanelBox";
import { AnimatePresence, motion } from "framer-motion";
import { Crosshair, X } from "lucide-react";

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

const CAT_META: Record<SensorCategory, { label: string; color: string }> = {
  radar:     { label: "RADAR",   color: "#3da9fc" },
  eoir:      { label: "EO/IR",   color: "#3df0a7" },
  ais:       { label: "AIS",     color: "#f0a93d" },
  passiveRf: { label: "PASS-RF", color: "#d83df0" },
};

export function SelectedTargetPanel() {
  const { selected } = useSelectedContact();
  const { selectedSensor, setSelectedSensor } = useSensorNodes();

  if (selectedSensor) {
    const m = CAT_META[selectedSensor.category];
    const hostile = selectedSensor.affiliation === "unfriendly";
    const ringColor = hostile ? "#f0436b" : m.color;

    return (
      <PanelBox title="SELECTED TARGET" icon={<Crosshair size={12} />} delay={0.1}>
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedSensor.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-2"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-[9px] tracking-[0.15em] font-display" style={{ color: ringColor }}>
                  {m.label}{hostile ? " · HOSTILE" : selectedSensor.affiliation ? " · FRIENDLY" : ""}
                </div>
                <span
                  className="text-sm font-display font-bold tracking-[0.15em]"
                  style={{ color: ringColor, textShadow: `0 0 8px ${ringColor}88` }}
                >
                  {selectedSensor.id}
                </span>
              </div>
              <button
                onClick={() => setSelectedSensor(null)}
                className="text-muted-foreground hover:text-foreground transition-colors"
                title="Clear"
              >
                <X size={12} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[9px]">
              <span className="text-primary/80 font-display tracking-wider">ID</span>
              <span className="text-foreground">{selectedSensor.id}</span>
              {selectedSensor.label && (
                <>
                  <span className="text-primary/80 font-display tracking-wider">LABEL</span>
                  <span className="text-foreground uppercase">{selectedSensor.label}</span>
                </>
              )}
              <span className="text-primary/80 font-display tracking-wider">TYPE</span>
              <span className="text-foreground">{m.label}</span>
              <span className="text-primary/80 font-display tracking-wider">STATUS</span>
              <span
                className="uppercase font-bold"
                style={{
                  color:
                    selectedSensor.status === "fault" ? "#f0436b" :
                    selectedSensor.status === "monitoring" ? "#f0a93d" :
                    "#3df0a7",
                }}
              >
                {selectedSensor.status}
              </span>
              <span className="text-primary/80 font-display tracking-wider">COORDS</span>
              <span className="text-foreground">{selectedSensor.coords || "—"}</span>
              <span className="text-primary/80 font-display tracking-wider">RANGE</span>
              <span className="text-foreground">{selectedSensor.range || "—"}</span>
              {selectedSensor.vessels !== undefined && (
                <>
                  <span className="text-primary/80 font-display tracking-wider">VESSELS</span>
                  <span className="text-foreground">{selectedSensor.vessels}</span>
                </>
              )}
              <span className="text-primary/80 font-display tracking-wider">AFFIL</span>
              <span className={`uppercase font-bold ${hostile ? "text-destructive glow-magenta" : "text-warning glow-orange"}`}>
                {hostile ? "HOSTILE" : selectedSensor.affiliation ? "FRIENDLY" : "—"}
              </span>
            </div>

            <div
              className="border rounded px-2 py-1"
              style={{ borderColor: `${ringColor}66`, color: ringColor, boxShadow: `0 0 6px ${ringColor}33` }}
            >
              <span className="text-[10px] font-bold tracking-[0.15em]">
                SENSOR NODE · {m.label}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </PanelBox>
    );
  }

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
