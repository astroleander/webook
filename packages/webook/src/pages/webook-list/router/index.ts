
import { loadFragmentFromRouter } from './utils';
import { Router } from './Router';
import type { RouterOptions, RouterItem } from './types';

export { loadFragmentFromRouter, RouterItem }; 

import * as hooks_routes from '@webrary/react/hooks';
import * as svelte_routes from '@webrary/svelte/common';
import * as rn_routes from '@webrary/rn/components';
import * as react_performance from '@webrary/react/performance';
import * as vue_routes from '@webrary/vue/common';
import * as solid_routes from '@webrary/solid/common';

export const initRouter = (props: {
  __debug: boolean,
  navElement: Element | null,
  options: RouterOptions
}) => {
  const router = new Router(props.navElement, props.options);
  
  router.addModuleRoutes(hooks_routes.default, { prefix: 'react.hooks', default: 'Sample' });
  router.addModuleRoutes(svelte_routes.default, { prefix: 'svelte.common' });
  router.addModuleRoutes(rn_routes.default, { prefix: 'rn.components' });
  router.addModuleRoutes(react_performance.default, { prefix: 'react.performance' });
  router.addModuleRoutes(vue_routes.default, { prefix: 'vue.common' });
  router.addModuleRoutes(solid_routes.default, { prefix: 'solid.common' });
}


