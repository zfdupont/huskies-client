import { useLayoutEffect, useState } from 'react';

const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

const useIsMobile = ()  => {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  useLayoutEffect(() => {
    const updateSize = debounce(() => {
      setIsMobile(window.innerWidth < 768);
    }, 250);
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return isMobile;
};

export default useIsMobile;
