import React, { createContext, useEffect, useState } from "react";
import { useWindowDimensions } from "react-native"

export const MixedContext = createContext<any>(null);

export const MixedContextProvider = ({ options, children }) => {
  const { width, height } = useWindowDimensions();
  const constant = 'constant';
  const [state, setState] = useState('state');
  const [delay, setDelay] = useState<any>(null);
  const [delay2, setDelay2] = useState<any>(null);
  useEffect(() => {
    setTimeout(() => setDelay('delay +1s'),1000);
    setTimeout(() => setDelay('delay +3s'),3000);
    setTimeout(() => setDelay('delay +5s'),5000);
  }, [])
  useEffect(() => {
    setTimeout(() => setDelay('delay2 +2s'), 2000);
  }, [])

  return <MixedContext.Provider value={{
    windowWidth: width,
    windowHeight: height,
    options: options,
    constant,
    state,
    delay,
    delay2,
    immediate: 'immediate'
  }}>
    {children}
  </MixedContext.Provider>
}