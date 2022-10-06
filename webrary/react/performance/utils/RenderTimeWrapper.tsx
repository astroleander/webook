import React, { useCallback } from "react";
import { useState } from "react";

export const RenderTimeWrapper = (props) => {
  const [actualDuration, setActualDuration] = useState<number | undefined>(undefined);
  const [baseDuration, setBaseDuration] = useState<number | undefined>(undefined);

  const onRender = useCallback<React.ProfilerOnRenderCallback>((
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime
  ) => {
    if (phase === 'mount') {
      setActualDuration(actualDuration);
      setBaseDuration(baseDuration);
    }
  }, [],
  );

  const Children = React.useMemo(() => () => props.children, []);

  return <>
    <div style={styles.wrapper}>
      <div style={styles.wrapper}>
        <React.Profiler id={'ts'+ props.children.toString()} onRender={onRender}>
          <Children />
        </React.Profiler>
      </div>
    <hr style={{height:"1px", backgroundColor: "#6666"}}/>
    <Output baseDuration={baseDuration} actualDuration={actualDuration} />
  </div>
  </>
};

const Output = (props: {
  baseDuration?: number,
  actualDuration?: number,
}) => {
  if (props.actualDuration === undefined) {
    return (<div>rendering...</div>)
  }
  return (<div style={{ fontFamily: 'monospace' }}>
    base duration: {props.baseDuration?.toFixed(2)}
    <br />
    actual duration: {props.actualDuration?.toFixed(2)}
  </div>);
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    boxSizing: 'border-box',
    background: '#B3B3B344',
    borderRadius: 4,
    padding: 12,
    margin: 4,
  }, 
};