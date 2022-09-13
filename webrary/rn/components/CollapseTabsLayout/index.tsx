import React, { useRef, useState } from 'react';
import { Animated, ScrollView } from 'react-native';
import { FilledView as View } from './inspector/FilledView';

const SHIFT = 30;
const HEIGHT = 300;
const TAB_HEIGHT = 50;
export const CollapseTabsLayout = () => {
  const height = useRef(new Animated.Value(0));
  const [seeOverflow, setSeeOverflow] = useState(false);
  return (
    <>
      <span>seeOverflow:</span>
      <input type="checkbox" style={{ display: 'hidden' }} onChange={(e)=> setSeeOverflow((e.nativeEvent as any).target.checked)}/>
      <View name={'Demo'}>
        <View name={'outoftop'} style={{ height: 50, backgroundColor: 'white' }} />
        <View name={'Visible'} style={{ height: HEIGHT, zIndex: seeOverflow ? 1 : -1}}>
          {/* <View name={'actionbar'} style={{height: 50}}/> */}
          <Animated.View style={{
            height: 50,
            zIndex: 999,
            backgroundColor: '#F003',
            transform: [{
              translateY: height.current.interpolate({
                inputRange: [0, SHIFT],
                outputRange: [0, -SHIFT],
                extrapolateRight: 'clamp',
              })
            }]
          }}>
            <View name={'tabs'} style={{ height: TAB_HEIGHT }} />
            <View name={'children'} style={{ height: HEIGHT + SHIFT - TAB_HEIGHT }}>
              <ScrollView
                scrollEventThrottle={16}
                onScroll={Animated.event(
                  [{ nativeEvent: { contentOffset: { y: height.current } } }],
                  {
                    useNativeDriver: true, 
                    listener: (evt) => {
                      console.log((evt.nativeEvent as any).contentOffset.y)
                      console.log('----------')
                    }
                  }
                )}>
                <View name={'child 01'} style={{ height: 80 }} />
                <View name={'child 02'} style={{ height: 80 }} />
                <View name={'child 03'} style={{ height: 80 }} />
                <View name={'child 04'} style={{ height: 80 }} />
                <View name={'child 05'} style={{ height: 80 }} />
                <View name={'child 06'} style={{ height: 80 }} />
                <View name={'child 07'} style={{ height: 80 }} />
                <View name={'child 08'} style={{ height: 80 }} />
              </ScrollView>
            </View>
          </Animated.View>
        </View>
        <View name={'outofbottom'} style={{ height: 50, backgroundColor: 'white' }} />
      </View>
    </>);
}

