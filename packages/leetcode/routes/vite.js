// const __DOMAIN__ = 'problems';

export const viteRoutes = async () => {
  const loaders = await import.meta.glob('../problems/**/*.js'); 
  const source = await import.meta.glob('../problems/**/*.js', { as: 'raw' });

  const routes = {};

  for (const moduleName in source) {
    const [/** project pointer */, /** src pointer */, problems, strategy] = moduleName.replace(/\.[\w]+$/, '').split('/');
    routes[problems] = routes[problems] || {};
    routes[problems][strategy] = () => ({
      moduleName: [problems, strategy].join('/'),
      moduleLoader: loaders[moduleName],
      moduleRaw: source[moduleName],
    })
  }
  return routes;
};