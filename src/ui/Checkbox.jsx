import { Check } from "./icons";

export default function Checkbox({ checked = false, className = "" }) {
  return (
    <span
      className={`inline-flex h-4 w-4 items-center justify-center rounded border border-border ${checked ? "bg-accent text-bg" : "bg-transparent"} ${className}`}
    >
      {checked && <Check className="h-3 w-3" />}
    </span>
  );
}
