import React, { createContext, useContext, useEffect, useState } from 'react'
import { useWindowDimensions } from 'react-native'

export const DimensionsContext = createContext({})
export const ConstantContext = createContext(null)
export const StateContext = createContext<any>(null)
export const DelayContext = createContext<any>(null)
export const Delay2Context = createContext<any>(null)
export const OptionsContext = createContext<any>(null)
export const Contexts = [
  DimensionsContext,
  ConstantContext,
  StateContext,
  DelayContext,
  Delay2Context,
  OptionsContext,
]

const DimensionsProvider = ({ children }) => {
  const { width, height } = useWindowDimensions()
  return (
    <DimensionsContext.Provider
      value={{
        windowWidth: width,
        windowHeight: height,
      }}
    >
      {children}
    </DimensionsContext.Provider>
  )
}

const StateProvider = ({ children }) => {
  const [state, setState] = useState('state')
  return <StateContext.Provider value={{ state: state }}>{children}</StateContext.Provider>
}

const DelayProvider = ({ children }) => {
  const [delay, setDelay] = useState<any>(null)
  useEffect(() => {
    setTimeout(() => setDelay('delay +1s'), 1000)
    setTimeout(() => setDelay('delay +3s'), 3000)
    setTimeout(() => setDelay('delay +5s'), 5000)
  }, [])
  return <DelayContext.Provider value={{ delay: delay }}>{children}</DelayContext.Provider>
}

const Delay2Provider = ({ children }) => {
  const [delay, setDelay] = useState<any>(null)
  useEffect(() => {
    setTimeout(() => setDelay('delay2 +2s'), 2000)
  }, [])
  return <Delay2Context.Provider value={{ delay: delay }}>{children}</Delay2Context.Provider>
}

const reducer = (contexts: Array<{ provider; value }>, app) => {
  return contexts.reduceRight((children, { provider: P, value }) => {
    return <P value={value}>{children}</P>
  }, app)
}

export const ReducedProvider = ({ options, children }) => {
  return reducer(
    [
      { provider: DimensionsProvider, value: null },
      { provider: ConstantContext.Provider, value: { constant: 'constant'} },
      { provider: createContext('immediate').Provider, value: { immediate:  'immediate' } },
      { provider: StateProvider, value: null },
      { provider: DelayProvider, value: null },
      { provider: Delay2Provider, value: null },
      { provider: OptionsContext.Provider, value: { options: options} },
    ],
    children,
  )
}