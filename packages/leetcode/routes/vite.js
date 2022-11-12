// const __DOMAIN__ = 'problems';

export const viteRoutes = async () => {
  const loaders = await import.meta.glob('../problems/**/*.js'); 
  const source = await import.meta.glob('../problems/**/*.js', { as: 'raw' });

  const routes = {};

  for (const moduleName in source) {
    const [/** project pointer */, /** src pointer */, problems, strategy] = moduleName.split('/');
    routes[problems] = routes[problems] || {};
    routes[problems][strategy.replace(/\.[\w]+$/, '')] = {
      moduleName: moduleName,
      moduleLoader: loaders[moduleName],
      moduleRaw: source[moduleName],
    }
  }
  return routes;
};