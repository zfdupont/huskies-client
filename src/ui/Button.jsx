export default function Button({ size = "md", variant = "text", className = "", ...props }) {
  const base = "inline-flex items-center justify-center rounded font-medium transition-colors";
  const sizes = { sm: "text-xs px-2 py-1", md: "text-sm px-3 py-1.5" };
  const variants = {
    text: "text-accent hover:bg-accent/10",
    solid: "bg-accent text-bg hover:bg-accent/90",
  };
  return <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props} />;
}
