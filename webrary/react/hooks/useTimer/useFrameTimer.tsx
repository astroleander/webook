import { useEffect, useRef, useState } from 'react';

export const useFrameTimer = (updateInterval: number) => {
  const start = useRef<number>(Date.now()).current;
  const last = useRef<number>(Date.now());
  const [time, setTime] = useState(0);
  useEffect(() => {
    const fn = () => {
      requestAnimationFrame(() => {
        const now = Date.now();
        if (now - last.current > updateInterval) {
          setTime(now - start);
          last.current = now;
        };
        fn();
      })  
    }
    fn();
  }, [updateInterval]);

  return time;
}