export const loadRoutes = async (on) => {
  if (on === 'vite') {
    return (await import('./vite')).viteRoutes();
  }
}
