/* @see https://en.wikipedia.org/wiki/International_Article_Number */
import { CodeDegit, CodeMarker, CodeStructure } from "./types";

// MARKER INDEXES
export const MARKER_POS = new Set([0, 1, 2, 43, 44, 45, 46, 47, 92, 93, 94]);

export const CODE: CodeDegit = {
  L: (x: number) => {
    return CODE_MATRIX[x * 3 + 0];
  } ,
  R: (x: number) => {
    return CODE_MATRIX[x * 3 + 2];
  },
  G: (x: number) => {
    return CODE_MATRIX[x * 3 + 1];
  }
}

// START(3) - LEFT(42) - CENTER(5) - RIGHT(42) - END(3) = 95
export const MARKER: CodeMarker = {
  START: '101',
  CENTER: '01010',
  END: '101',
}

export const CODE_MATRIX = [
  // L_CODE,    G_CODE,    R_CODE,
  '0001101', '0100111', '1110010', // 0
  '0011001', '0110011', '1100110', // 1
  '0010011', '0011011', '1101100', // 2
  '0111101', '0100001', '1000010', // 3
  '0100011', '0011101', '1011100', // 4
  '0110001', '0111001', '1001110', // 5
  '0101111', '0000101', '1010000', // 6
  '0111011', '0010001', '1000100', // 7
  '0110111', '0001001', '1001000', // 8
  '0001011', '0010111', '1110100', // 9
]

export const STRUCTURE: CodeStructure = {
  EAN_13: [
    //  LEFT,    RIGHT,
    'LLLLLL', 'RRRRRR', // 0
    'LLGLGG', 'RRRRRR', // 1
    'LLGGLG', 'RRRRRR', // 2
    'LLGGGL', 'RRRRRR', // 3
    'LGLLGG', 'RRRRRR', // 4
    'LGGLLG', 'RRRRRR', // 5
    'LGGGLL', 'RRRRRR', // 6
    'LGLGLG', 'RRRRRR', // 7
    'LGLGGL', 'RRRRRR', // 8
    'LGGLGL', 'RRRRRR', // 9
  ],
  EAN_8: [
    'LLLL', 'RRRR',
  ]
}
