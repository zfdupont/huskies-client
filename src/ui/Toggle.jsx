export default function Toggle({ checked = false, onChange, size = "md", ...props }) {
  const track = size === "sm" ? "h-4 w-7" : "h-5 w-9";
  const knob = size === "sm" ? "h-3 w-3" : "h-4 w-4";
  const shift = checked
    ? size === "sm" ? "translate-x-3.5" : "translate-x-4"
    : "translate-x-0.5";
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange?.({ target: { checked: !checked } })}
      className={`relative inline-flex ${track} shrink-0 items-center rounded-full transition-colors ${checked ? "bg-accent" : "bg-fg/25"}`}
      {...props}
    >
      <span className={`inline-block ${knob} transform rounded-full bg-white shadow transition-transform ${shift}`} />
    </button>
  );
}
