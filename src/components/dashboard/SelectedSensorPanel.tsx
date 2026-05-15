import { useSensorNodes, SensorCategory } from "@/context/SensorNodesContext";
import { PanelBox } from "./PanelBox";
import { Radar, Eye, Plane, Antenna, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const META: Record<SensorCategory, { label: string; color: string; Icon: any }> = {
  radar:     { label: "RADAR",   color: "#3da9fc", Icon: Radar },
  eoir:      { label: "EO/IR",   color: "#3df0a7", Icon: Eye },
  ais:       { label: "AIS",     color: "#f0a93d", Icon: Plane },
  passiveRf: { label: "PASS-RF", color: "#d83df0", Icon: Antenna },
};

export function SelectedSensorPanel() {
  const { selectedSensor, setSelectedSensor } = useSensorNodes();
  if (!selectedSensor) return null;
  const m = META[selectedSensor.category];
  const Icon = m.Icon;

  return (
    <PanelBox title="SENSOR DETAIL" icon={<Icon size={12} />} delay={0.05}>
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
            <div className="flex items-center gap-2">
              <div
                className="flex items-center justify-center w-7 h-7 rounded-full border"
                style={{
                  borderColor: m.color,
                  color: m.color,
                  background: "rgba(8,16,28,0.6)",
                  boxShadow: `0 0 8px ${m.color}66`,
                }}
              >
                <Icon size={14} />
              </div>
              <div>
                <div className="text-[9px] tracking-[0.15em] font-display" style={{ color: m.color }}>
                  {m.label}
                </div>
                <div className="text-sm font-display font-bold tracking-[0.12em] text-foreground">
                  {selectedSensor.id}
                </div>
              </div>
            </div>
            <button
              onClick={() => setSelectedSensor(null)}
              className="text-muted-foreground hover:text-foreground transition-colors"
              title="Close"
            >
              <X size={12} />
            </button>
          </div>

          <div className="grid grid-cols-[60px_1fr] gap-x-3 gap-y-1 text-[9px]">
            {selectedSensor.label && (
              <>
                <span className="text-primary/80 font-display tracking-wider">LABEL</span>
                <span className="text-foreground uppercase">{selectedSensor.label}</span>
              </>
            )}
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
            <span className="text-primary/80 font-display tracking-wider">RANGE</span>
            <span className="text-foreground">{selectedSensor.range || "—"}</span>
            <span className="text-primary/80 font-display tracking-wider">COORDS</span>
            <span className="text-foreground">{selectedSensor.coords || "—"}</span>
            {selectedSensor.vessels !== undefined && (
              <>
                <span className="text-primary/80 font-display tracking-wider">VESSELS</span>
                <span className="text-foreground">{selectedSensor.vessels}</span>
              </>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </PanelBox>
  );
}
