export default function IconButton({ variant = "plain", className = "", children, ...props }) {
  const base = "inline-flex items-center justify-center rounded-full transition-colors";
  const variants = {
    plain: "p-2 text-fg hover:bg-fg/10",
    elevated: "p-3 bg-accent text-bg shadow-lg hover:bg-accent/90",
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
