import React, { useContext, useEffect, useState } from "react";
import { View, Text } from "react-native";
import { Contexts } from "./ReducedContext";

export const useContexts = () => {
  const obj1 = useContext(Contexts[0]);
  const obj2 = useContext(Contexts[1]);
  const obj3 = useContext(Contexts[2]);
  const obj4 = useContext(Contexts[3]);
  const obj5 = useContext(Contexts[4]);
  const obj6 = useContext(Contexts[5]);
  return [obj1, obj2, obj3, obj4, obj5, obj6, {
    ...obj1,
    ...obj2,
    ...obj3,
    ...obj4,
    ...obj5,
    ...obj6,
  }];
}

export const DummyChild = ({ content }) => {
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

export const ExportedReducedContext = () => {
  const contents = useContexts();
  return <>{contents.map((content, idx) => {
    return <DummyChild key={idx} content={content} />;
  })}</>
}