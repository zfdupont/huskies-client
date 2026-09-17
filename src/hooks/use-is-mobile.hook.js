import { useEffect, useState } from 'react';

// Width (px) below which the viewport is treated as mobile.
export const MOBILE_BREAKPOINT = 768;

// Tracks whether the viewport is narrower than `breakpoint`, using matchMedia so
// the callback fires only when the breakpoint is actually crossed (no resize
// debounce needed) and the initial value is correct on first render.
const useIsMobile = (breakpoint = MOBILE_BREAKPOINT) => {
  const query = `(max-width: ${breakpoint - 1}px)`;
  const [isMobile, setIsMobile] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = (event) => setIsMobile(event.matches);
    // Resync in case the width changed between render and effect commit.
    setIsMobile(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return isMobile;
};

export default useIsMobile;
