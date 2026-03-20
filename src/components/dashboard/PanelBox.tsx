import { ReactNode } from "react";

interface PanelBoxProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export function PanelBox({ title, children, className = "" }: PanelBoxProps) {
  return (
    <div className={`border border-border rounded-md panel-bg overflow-hidden ${className}`}>
      {title && (
        <div className="px-3 py-1.5 panel-header-border bg-secondary/30">
          <span className="text-[11px] text-primary glow-blue tracking-[0.15em] uppercase font-display font-semibold">
            {title}
          </span>
        </div>
      )}
      <div className="p-2.5">{children}</div>
    </div>
  );
}
