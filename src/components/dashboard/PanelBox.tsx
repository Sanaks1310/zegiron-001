import { ReactNode, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface PanelBoxProps {
  title?: string;
  children: ReactNode;
  className?: string;
  delay?: number;
  collapsible?: boolean;
}

export function PanelBox({ title, children, className = "", delay = 0, collapsible = true }: PanelBoxProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className={`border border-border rounded-md panel-bg overflow-hidden ${className}`}
    >
      {title && (
        <div
          className={`px-3 py-1.5 panel-header-border bg-secondary/30 flex items-center justify-between ${
            collapsible ? "cursor-pointer select-none hover:bg-secondary/50 transition-colors" : ""
          }`}
          onDoubleClick={() => collapsible && setCollapsed((p) => !p)}
        >
          <span className="text-[11px] text-primary glow-blue tracking-[0.15em] uppercase font-display font-semibold">
            {title}
          </span>
          {collapsible && (
            <motion.span
              animate={{ rotate: collapsed ? -90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-3 h-3 text-primary/50" />
            </motion.span>
          )}
        </div>
      )}
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-2.5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
