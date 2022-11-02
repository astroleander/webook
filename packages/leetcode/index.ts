import { loadRoutes } from './routes';

const modules = await loadRoutes(__BUILD__);
const name = 'leetcode';

console.log(modules);
// console.log(modules['../src/1.two.sum/index.svelte']())
modules['hell2sum']().then(m => console.log(m))

export { 
  modules,
  name,
};
