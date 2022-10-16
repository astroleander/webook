import React from 'react';
import { RenderTimeWrapper } from '../utils/RenderTimeWrapper';

const MatryoshkaProvider = ({ count, children }) => {
  const Context = React.createContext({
    random: Math.random(),
    count: count,
  });
  if (count === 0) {
    return <Context.Provider value={count}>
      {children}
    </Context.Provider>;
  } else {
    return (<MatryoshkaProvider count={count - 1}>
      <Context.Provider value={count}>
        {children}
      </Context.Provider>
    </MatryoshkaProvider>);
  }
}

const RealComponent = ({ }) => {
  return <div>loaded child</div>
}

export const Sample = () => {
  return (<div style={{
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '1em',
  }}>
    <div>
      <div>no provider wrappers:</div>
      <RenderTimeWrapper>
        <RealComponent />
      </RenderTimeWrapper>

    </div>

    <div>
      <div>300 provider wrappers:</div>
      <RenderTimeWrapper>
        <MatryoshkaProvider count={300}>
          <RealComponent />
        </MatryoshkaProvider>
      </RenderTimeWrapper>
    </div>

    <div>
      <div>500 provider wrappers:</div>
      <RenderTimeWrapper>
        <MatryoshkaProvider count={500}>
          <RealComponent />
        </MatryoshkaProvider>
      </RenderTimeWrapper>
    </div>
  </div>);
}
