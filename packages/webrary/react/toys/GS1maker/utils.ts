import { CODE, MARKER, STRUCTURE } from "./constants";
import { AvailableCode, AvailableType } from "./types";

export const transfromString = (s: string) => {
  let left, right;
  // GS1 (EAN_13)
  if (s.length === 13) {
    left = {
      str:s.substring(1, 7),
      rules: STRUCTURE.EAN_13[parseInt(s[0]) * 2],
    };
    right = {
      str: s.substring(7, 13),
      rules: STRUCTURE.EAN_13[parseInt(s[0]) * 2 + 1],
    };
    return [
      MARKER.START,
      forEachChar(left.str, transfromChar, left.rules),
      MARKER.CENTER,
      forEachChar(right.str, transfromChar, right.rules),
      MARKER.END,
    ].join('');
  }
  // EAN_8
  else if (s.length === 8) {

  }
}

const transfromChar = (c: string, i: number, r: typeof STRUCTURE.EAN_13 | typeof STRUCTURE.EAN_8) => {
  const number = parseInt(c, 10) as AvailableCode;
  const rule = r[i] as AvailableType;
  if (Number.isInteger(number)) {
    return CODE[rule](number);
  }
  return '';
};

export const forEachChar = (x: string, apply: (...props: any) => string, ...props: any) => {
  const y = [];
  for (let i = 0; i < x.length; i++) {
    y[i] = apply(x[i], i, ...props);
  }
  return y.join('');
};