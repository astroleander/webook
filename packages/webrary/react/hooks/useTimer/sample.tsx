import React from 'react';
import { useClassicTimer } from './useClassicTimer';
import { useClassicCounter } from './useClassicCounter';
import { useFrameTimer } from './useFrameTimer';
import { useFrameCounter } from './useFrameCounter';

export const Sample = () => {
  const interval = 1111;
  const classic_timer = useClassicTimer(interval);
  const frame_timer = useFrameTimer(interval);
  const freme_counter = useFrameCounter(interval);
  const class_counter = useClassicCounter(interval);
  return (
  <section>
    <div><code>useClassicTimer</code>: {classic_timer}</div>
    <div><code>useFrameTimer</code>: {frame_timer}</div>
    <div><code>useClassicCounter</code>: {class_counter}</div>
    <div><code>useFrameCounter</code>: {freme_counter}</div>
  </section>);
};
