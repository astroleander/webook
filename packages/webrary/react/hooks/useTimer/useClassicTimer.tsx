import { useEffect, useRef, useState } from 'react';

export const useClassicTimer = (updateInterval: number) => {
  const start = useRef(Date.now()).current;
  const [time, setTime] = useState(0);
  const timer = useRef<NodeJS.Timer | null>(null);
  useEffect(() => {
    if (timer.current) {
      clearInterval(timer.current);
    }
    timer.current = setInterval(() => {
      setTime(Date.now() - start);
    }, updateInterval);
  }, [updateInterval]);

  return time;
}