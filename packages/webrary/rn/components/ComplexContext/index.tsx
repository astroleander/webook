import React, { useContext, useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import { ExportedReducedContext } from './ExportedReducedContext'
import { MixedContext, MixedContextProvider } from './MixedContext'
import { ReducedProvider, Contexts } from './ReducedContext'

// this component is for test how render triggered if we have a complex context

const Case = ({ desc, children }) => {
  return (
    <View>
      <Text style={{ fontWeight: 'bold' }}>{desc}</Text>
      <View style={{ height: 100, overflow:'scroll', flexDirection: 'row', flexWrap: 'wrap' }}>{children}</View>
    </View>
  )
}

export const App = () => {
  // const combineContext = use
  return (
    <View>
      <Case desc={'Naked'}>
        <Child context={MixedContext} />
      </Case>

      <Case desc={'MixedContext'}>
        <MixedContextProvider options={{ option: 'option' }}>
          <Child context={MixedContext} />
          <Child context={MixedContext} />
          <Child context={MixedContext} />
        </MixedContextProvider>
      </Case>

      <Case desc={'ReducedContext'}>
        <ReducedProvider options={{ option: 'option' }}>
          {Contexts.map((SeparatedContext) => {
            return <Child context={SeparatedContext} />
          })}
        </ReducedProvider>
      </Case>

      <Case desc={'ReducedContext but exported together'}>
        <ReducedProvider options={{ option: 'option' }}>
          <ExportedReducedContext />
        </ReducedProvider>
      </Case>
    </View>
  )
}

export const Child = ({ context }) => {
  const content = useContext(context)
  const [renderTime, setRenderTime] = useState(0)
  useEffect(() => {
    setRenderTime((v) => ++v)
  }, [content])

  return (
    <View
      style={{
        padding: 4,
        margin: 4,
        width: '18%',
        borderRadius: 4,
        backgroundColor: '#f8f8f866',
      }}
    >
      <View>
        <Text>render Time: {renderTime}</Text>
      </View>
      <View>
        <Text>content: {JSON.stringify(content)}</Text>
      </View>
    </View>
  )
}
