export const getMapkey = (...keys: string[]) => {
  return keys.join('::');
}