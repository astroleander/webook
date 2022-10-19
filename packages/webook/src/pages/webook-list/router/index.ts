
import { loadFragmentFromRouter, Parser, ParserBuilder } from './utils';
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

  router.addModuleRoutes(hooks_routes.default,  [ParserBuilder.setPrefix('react.hooks')]);
  router.addModuleRoutes(svelte_routes.default, [ParserBuilder.setPrefix('svelte.common')]);
  router.addModuleRoutes(rn_routes.default,     [ParserBuilder.setPrefix('rn.common')]);
  router.addModuleRoutes(react_performance.default, [ParserBuilder.setPrefix('react.performance')]);
  router.addModuleRoutes(vue_routes.default,    [ParserBuilder.setPrefix('vue.common')]);
  router.addModuleRoutes(solid_routes.default, ParserBuilder.setPrefix('solid.common'));

  router.addModuleRoutesAsync(import('@webook/graphics'), [Parser.raw]);
}
