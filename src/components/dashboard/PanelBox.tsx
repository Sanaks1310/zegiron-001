import { ReactNode } from "react";
import { motion } from "framer-motion";

interface PanelBoxProps {
  title?: string;
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function PanelBox({ title, children, className = "", delay = 0 }: PanelBoxProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className={`border border-border rounded-md panel-bg overflow-hidden ${className}`}
    >
      {title && (
        <div className="px-3 py-1.5 panel-header-border bg-secondary/30">
          <span className="text-[11px] text-primary glow-blue tracking-[0.15em] uppercase font-display font-semibold">
            {title}
          </span>
        </div>
      )}
      <div className="p-2.5">{children}</div>
    </motion.div>
  );
}
