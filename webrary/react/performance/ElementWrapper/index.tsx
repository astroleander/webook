import React, { useEffect, useRef } from 'react';
import { RenderTimeWrapper } from '../utils/RenderTimeWrapper';

const Wrapper = ({ count, children }) => {
  if (count === 0) {
    return <div>
      {children}
    </div>;
  } else {
    return (<Wrapper count={count - 1}>
      <div style={{background: '#F001'}}>
        {children}
      </div>
    </Wrapper>);
  }
}

const RealComponent = ({ }) => {
  return <div>loaded child</div>
}

export const Sample = () => {
  const inputRef = useRef();

  const timestamp = useRef(Date.now());
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
        <Wrapper count={300}>
          <RealComponent />
        </Wrapper>
      </RenderTimeWrapper>
    </div>

    <div>
      <div>500 provider wrappers:</div>
      <RenderTimeWrapper>
        <Wrapper count={500}>
          <RealComponent />
        </Wrapper>
      </RenderTimeWrapper>
    </div>
  </div>);
}
