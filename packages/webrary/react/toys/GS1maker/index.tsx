import React from 'react';
import { useState } from 'react';
import { MARKER_POS } from './constants';
import { transfromString } from './utils';

const Cell = (props: {
  value: string,
  index: number,
}) => <div style={{
  backgroundColor: props.value === '1' ? 'black' : 'white',
  height: MARKER_POS.has(props.index) ? '24mm' : '22.86mm',
  width: '0.33mm',
}} />

const Code = ({ code }: { code: string }) => {
  return <div style={{
    display: 'flex',
    flexDirection: 'row',
    padding: '0.33mm 2.31mm 0 3.63mm',
  }}>
    {Array.from(code).map(((char, idx) => {
      return <Cell key={idx} value={char} index={idx} />
    }))}
  </div>
}

const Number = ({ code, number }: { code: string, number: string }) => {
  const postprocessedNumber = 
    + number.slice(1, number.length / 2 + 1)
    + '-'
    + number.slice(number.length / 2 + 1, number.length);
  return <div style={{
    display: 'flex',
    flexDirection: 'row',
    height: '0.99mm',
  }}>
    <div style={{
      width: '0.33mm',
      color: 'black',
      fontSize: '1mm',
      fontWeight: 'bolder',
      transform: 'scale(0.7) translateY(-3.08mm) translateX(-3.63mm)'  
    }}
    >
      {number[0]}
    </div>
    {Array.from(code).map(((char, idx) => {
      return <div style={{
        width: '0.33mm',
        color: 'black',
        fontSize: '0.99mm',
        transform: 'scale(0.7) translateY(-3.08mm) translateX(1.4mm)'
      }}>
        {((idx - 3) % 7) || MARKER_POS.has(idx) ? '' : postprocessedNumber[((idx - 3) / 7)]}
      </div>
    }))}
  </div>
}

export const GS1maker = () => {
  // TODO: number input
  const [input, setInput] = useState('9783100025401');
  const code = transfromString(input);
  if (!input || !code) return null;

  return <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }}>
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      backgroundColor: 'white',
      // transform: 'scale(2)',
    }}>
      <Code code={code} />
      <Number code={code} number={input} />
    </div>
  </div>;
}