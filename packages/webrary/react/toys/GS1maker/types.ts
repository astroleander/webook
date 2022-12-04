export type CodeDegit = Record<AvailableType, ((x: AvailableCode) => string)>;

export type CodeStructure = Record<AvailableRules, Array<string>>;

export type CodeMarker = Record<AvailableMarkers, string>;

export type AvailableCode = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 0;

export type AvailableType = 'L' | 'R' | 'G';

export type AvailableRules = 'EAN_13' | 'EAN_8';

export type AvailableMarkers = 'START' | 'CENTER' | 'END';