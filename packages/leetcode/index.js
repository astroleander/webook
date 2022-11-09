import { loadRoutes } from './routes';

const modules = await loadRoutes(__BUILD__);
const name = 'leetcode';

export { 
  modules,
  name,
};
