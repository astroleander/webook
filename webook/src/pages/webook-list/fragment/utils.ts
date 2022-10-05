export const getMapkey = (...keys: string[]) => {
  return keys.join('::');
}

export const effects = {
  recordTimestamp: () => {
    const start = window?.performance.now();
    return () => (window?.performance.now() - start).toFixed(2) + 'ms'
  }
}

export const collectTemplate = async () => {
  const result:Record<string, string[]> = {};
  const templates = await import.meta.glob(`./templates/**/*.html` as const);
  Object.keys(templates).forEach(themePath => {
    const [_root, _folder, part, template] = themePath.split('/');
    const name = template.replace('.html', '');
    result[part] ? result[part].push(name) : result[part] = [name];
  })
  return result;
}

export const collectTheme = async () => {
  const themes = await import.meta.glob('./themes/**/*.module.css');
  return Object.keys(themes).map(themePath => themePath.split('/').at(-1)?.replace('.module.css', ''))
}

