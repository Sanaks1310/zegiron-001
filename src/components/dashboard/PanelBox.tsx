import { ReactNode } from "react";

interface PanelBoxProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export function PanelBox({ title, children, className = "" }: PanelBoxProps) {
  return (
    <div className={`border border-border panel-bg ${className}`}>
      {title && (
        <div className="px-2 py-1 border-b border-border">
          <span className="text-[10px] text-muted-foreground tracking-widest uppercase">
            {title}
          </span>
        </div>
      )}
      <div className="p-2">{children}</div>
    </div>
  );
}
