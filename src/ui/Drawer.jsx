export default function Drawer({
  variant = "docked",
  open = false,
  onClose,
  width = 200,
  className = "",
  children,
  ...props
}) {
  const panel = (
    <aside
      data-variant={variant}
      style={{ width }}
      className={`fixed left-0 top-0 h-full overflow-y-auto bg-surface transition-transform ${variant === "docked" ? "border-r border-border" : "z-[13000]"} ${open ? "translate-x-0" : "-translate-x-full invisible"} ${className}`}
      {...props}
    >
      {children}
    </aside>
  );

  if (variant === "docked") return panel;

  return (
    <>
      {open && <div onClick={onClose} className="fixed inset-0 z-[12999] bg-black/50" />}
      {panel}
    </>
  );
}
