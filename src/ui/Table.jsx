export function Table({ className = "", children, ...props }) {
  return (
    <table className={`w-full border-collapse text-xs text-fg ${className}`} {...props}>
      {children}
    </table>
  );
}

export function Thead({ children }) {
  return <thead>{children}</thead>;
}

export function Tbody({ children }) {
  return <tbody>{children}</tbody>;
}

export function Tr({ className = "", children, ...props }) {
  return (
    <tr className={`border-b border-border last:border-0 ${className}`} {...props}>
      {children}
    </tr>
  );
}

export function Th({ className = "", children, ...props }) {
  return (
    <th className={`px-2 py-1 text-center font-bold text-fg ${className}`} {...props}>
      {children}
    </th>
  );
}

export function Td({ className = "", children, ...props }) {
  return (
    <td className={`px-2 py-1 text-center text-muted ${className}`} {...props}>
      {children}
    </td>
  );
}
