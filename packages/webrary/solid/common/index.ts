import { getRoutesBasedBuildTool } from '@webrary/common';

export const routes = getRoutesBasedBuildTool({
  vite: import.meta.glob('./**/index.*'),
});

export default routes;
