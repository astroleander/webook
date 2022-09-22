import * as hooks_routes from '@webrary/react/hooks';
import * as svelte_routes from '@webrary/svelte/common';
import * as rn_routes from '@webrary/rn/components';

import { createRouterItem, loadFragmentFromRoute, renameRoutesWithDomain } from './utils';
import { Route } from './types';
import { __log } from '../utils';

export { loadFragmentFromRoute }; 
export const routes = {
  ...renameRoutesWithDomain(hooks_routes.default, 'react.hooks', 'Sample'),
  ...renameRoutesWithDomain(svelte_routes.default, 'svelte.common'),
  ...renameRoutesWithDomain(rn_routes.default as any, 'rn.components'),
};
export type { Route };

export const initRouter = (props: {
  navElement: Element | null;
  onRouterItemSelected?: (route: Route) => void;
  onRouterLoaded?: (routes: HTMLElement[]) => void;
  __debug?: true;
}) => {
  __log(props?.__debug, '[main.ts/routes]', routes);

  if (!props.navElement) { return; }
  // create
  const routesList = [] as Array<HTMLElement>;
  // add items
  for (const identifier in routes) {
    const routeItem = createRouterItem({
      route: routes[identifier],
      onSelected: props.onRouterItemSelected,
    });
    routesList.push(routeItem);
  }
  props.navElement.append(...routesList);
  // load
  props.onRouterLoaded?.(routesList);
};