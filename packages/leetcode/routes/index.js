export const loadRoutes = async (on) => {
  let routes = {};
  if (on === 'vite') {
    const viteRoutesLoader = await import('./vite');
    routes = await viteRoutesLoader.viteRoutes();
  }
  return routes;
}
