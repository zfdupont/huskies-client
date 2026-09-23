function Svg({ className = "h-4 w-4", children, ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function Star(props) {
  return (
    <Svg {...props}>
      <path d="M12 2l2.9 6.3 6.9.6-5.2 4.6 1.6 6.8L12 17.8 5.8 20.9l1.6-6.8L2.2 8.9l6.9-.6z" fill="currentColor" stroke="none" />
    </Svg>
  );
}

export function ChevronDown(props) {
  return (<Svg {...props}><path d="M6 9l6 6 6-6" /></Svg>);
}

export function ChevronUp(props) {
  return (<Svg {...props}><path d="M18 15l-6-6-6 6" /></Svg>);
}

export function Sun(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </Svg>
  );
}

export function Moon(props) {
  return (<Svg {...props}><path d="M21 12.8A9 9 0 1111.2 3 7 7 0 0021 12.8z" /></Svg>);
}

export function BarChart(props) {
  return (<Svg {...props}><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></Svg>);
}

export function Check(props) {
  return (<Svg {...props}><path d="M20 6L9 17l-5-5" /></Svg>);
}
