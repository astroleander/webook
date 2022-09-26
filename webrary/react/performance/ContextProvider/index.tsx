import React, { useEffect, useRef } from 'react';

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

const RealComponent = ({ start_timestamp }) => {
  return <div>loaded after: {Date.now() - start_timestamp}</div>
}

export const Sample = () => {
  const timestamp = useRef(Date.now());
  return (<div style={{
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
  }}>
    <div>
      <div>no provider wrappers:</div>
      <RealComponent start_timestamp={timestamp.current} />
    </div>

    <div>
      <div>300 provider wrappers:</div>
      <MatryoshkaProvider count={300}>
        <RealComponent start_timestamp={timestamp.current} />
      </MatryoshkaProvider>
    </div>

    <div>
      <div>500 provider wrappers:</div>
      <MatryoshkaProvider count={500}>
        <RealComponent start_timestamp={timestamp.current} />
      </MatryoshkaProvider>
    </div>
  </div>);
}
