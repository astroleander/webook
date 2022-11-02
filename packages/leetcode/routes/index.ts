export const loadRoutes = async (on: any) => {
  if (on === 'vite') {
    return (await import('./vite')).viteRoutes();
  }
}
