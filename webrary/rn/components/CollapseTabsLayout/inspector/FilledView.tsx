import lodash from "lodash";
import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";

export const FilledView = ({ children, name, style }: {
  name: string,
  children?: React.ReactNode,
  style?: ViewStyle,
}) => {
  return <View style={{
    ...defaultStyle.wrapper,
    ...commonBlock(),
    ...style
  }}>
    <View style={{justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, bottom: 0, left: 0, right: 0}} pointerEvents="box-none">
      <Text style={{
        ...defaultStyle.filledViewText,
      }}>{name}</Text>
    </View>
    {children}
  </View>;
}

const commonBlock = () => {
  const baseColor = lodash.sample(['#333', '#404', '#044', '#440', '#200', '#002', '#020']);
  return {
    backgroundColor: baseColor + '1',
    borderColor: baseColor + '3',
  }
}

const defaultStyle = StyleSheet.create({
  wrapper: {
    borderWidth: 1,
  },
  filledViewText: {
    position: 'absolute',
    textAlign: 'center',
    opacity: 0.3,
    fontWeight: 'bold',
  }
});