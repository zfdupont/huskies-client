import { Star, ChevronDown, ChevronUp } from "./icons";
import Collapse from "./Collapse";

export default function NavSection({ title, open, onToggle, children }) {
  return (
    <div className="w-full">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-fg hover:bg-fg/5"
      >
        <Star className="h-4 w-4 text-accent-2" />
        <span className="flex-1 text-left">{title}</span>
        {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      <Collapse open={open}>{children}</Collapse>
    </div>
  );
}

export function NavItem({ selected = false, onClick, children, className = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center px-6 py-1.5 text-left text-xs transition-colors ${selected ? "bg-accent/15 text-accent" : "text-fg hover:bg-fg/5"} ${className}`}
    >
      {children}
    </button>
  );
}
