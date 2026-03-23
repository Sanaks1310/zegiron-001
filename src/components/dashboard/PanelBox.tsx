import { ReactNode, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface PanelBoxProps {
  title?: string;
  children: ReactNode;
  className?: string;
  delay?: number;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  icon?: ReactNode;
}

export function PanelBox({ title, children, className = "", delay = 0, collapsible = true, defaultCollapsed = false, icon }: PanelBoxProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay, ease: "easeOut" }}
      className={`border border-border/60 rounded panel-bg overflow-hidden ${className}`}
    >
      {title && (
        <div
          className={`px-3 py-2 panel-header-border bg-secondary/20 flex items-center justify-between gap-2 ${
            collapsible ? "cursor-pointer select-none hover:bg-secondary/40 transition-colors" : ""
          }`}
          onClick={() => collapsible && setCollapsed((p) => !p)}
        >
          <div className="flex items-center gap-2">
            {icon && <span className="text-primary/70">{icon}</span>}
            <span className="text-[10px] text-primary glow-blue tracking-[0.18em] uppercase font-display font-semibold">
              {title}
            </span>
          </div>
          {collapsible && (
            <motion.span
              animate={{ rotate: collapsed ? -90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-3.5 h-3.5 text-primary/40" />
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
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-2.5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
