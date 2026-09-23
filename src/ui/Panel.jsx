export default function Panel({ className = "", children, ...props }) {
  return (
    <div className={`bg-surface border border-border rounded-lg shadow-sm ${className}`} {...props}>
      {children}
    </div>
  );
}
