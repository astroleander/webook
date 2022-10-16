import { getRoutesBasedBuildTool } from '@webrary/common';
const routes = getRoutesBasedBuildTool({
  vite: import.meta.glob('./**/index.vue'),
});

export default routes;