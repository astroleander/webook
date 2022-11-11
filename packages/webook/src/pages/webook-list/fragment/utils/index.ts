export * from './collect';
export * from './themeLoader';

export const getMapKey = (...keys: string[]) => {
  return keys.join('::');
}
