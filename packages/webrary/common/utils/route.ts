// import.meta.glob will parse when build, can only inject it from target file;
/**
 * Common routes generators
 * @param props the original build tool routes
 */
export const getRoutesBasedBuildTool = (props: {
  vite: Record<string, () => Promise<any>>;
}) => {
  if (__BUILD__ === 'vite') {
    return Object.fromEntries(Object.entries(props.vite).map(([key, value]) => [keySimplifer(key), value]));
  }
}

const keySimplifer = (key: string) => {
  const new_key_arr = key.split('/');
  const title = new_key_arr.map(str => {
    if (str.startsWith('index.')) return null;
    if (str === '.') return '';
    return str;
  }).join('');
  return title;
}
