// const m = await import.meta.glob('../src/**/*.svelte');
const m = {
  'hell2sum': () => import('../src/1.two.sum/index.svelte')
}
export const viteRoutes = async () => {
  // const m = await import.meta.glob('../src/**/*.svelte');
  return m;
};