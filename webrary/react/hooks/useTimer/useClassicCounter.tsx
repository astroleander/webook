import { useEffect, useRef, useState } from 'react';

export const useClassicCounter = (updateInterval: number) => {
  const [time, setTime] = useState(0);
  const timer = useRef<NodeJS.Timer | null>(null);
  useEffect(() => {
    if (timer.current) {
      clearInterval(timer.current);
    }
    timer.current = setInterval(() => {
      setTime(v => ++v);
    }, updateInterval);
  }, [updateInterval]);

  return time;
}