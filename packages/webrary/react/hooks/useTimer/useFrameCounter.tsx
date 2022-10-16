import { useEffect, useRef, useState } from 'react';

export const useFrameCounter = (updateInterval: number) => {
  const last = useRef<number>(Date.now());
  const fn = useRef<any>(null);

  const [time, setTime] = useState(0);
  useEffect(() => {
    if (fn.current) {
      fn.current = null;
    }
    fn.current = () => {
      requestAnimationFrame(() => {
        const now = Date.now();
        if (now - last.current > updateInterval) {
          setTime(v => ++v);
          last.current = now;
        };
        fn.current?.();
      })  
    }
    fn.current?.();
  }, [updateInterval]);

  return time;
}