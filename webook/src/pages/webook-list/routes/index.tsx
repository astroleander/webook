import * as hooks_routes from '@webrary/react/hooks';
import * as svelte_routes from '@webrary/svelte/common';
import * as rn_routes from '@webrary/rn/components';
import * as react_performance from '@webrary/react/performance';
import * as vue_routes from '@webrary/vue/common';

import { loadFragmentFromRoute, renameRoutesWithDomain, splitRouteIdentifier } from './utils';
import { Route } from './types';
import { __log } from '../utils';
import { LabelFactory } from './label/Label';

console.log(vue_routes);

export { loadFragmentFromRoute }; 
export const routes = {
  ...renameRoutesWithDomain(hooks_routes.default, 'react.hooks', 'Sample'),
  ...renameRoutesWithDomain(svelte_routes.default, 'svelte.common'),
  ...renameRoutesWithDomain(rn_routes.default as any, 'rn.components'),
  ...renameRoutesWithDomain(react_performance.default as any, 'react.performance'),
  ...renameRoutesWithDomain(vue_routes.default as any, 'vue.common'),
};

export const createRouteList = (props: {
  route: Route;
  onSelected?: (route: Route) => void;
}) => {
  const li = document.createElement('li');
  li.setAttribute('identifier', props.route.identifier);
  const {type, sub_type, name} = splitRouteIdentifier(props.route.identifier);
  li.appendChild(LabelFactory.create(type));
  sub_type && li.appendChild(LabelFactory.create(sub_type));
  li.append(name || '');
  li.onclick = (e) => props.onSelected?.(props.route);
  return li;
}

export const initRouter = (props: {
  navElement: Element | null;
  onRouteItemSelected?: (route: Route) => void;
  onRouterLoaded?: (routes: HTMLElement[]) => void;
  __debug?: true;
}) => {
  __log(props?.__debug, '[main.ts/routes]', routes);

  if (!props.navElement) { return; }
  // create
  const routesList = [] as Array<HTMLElement>;
  // add items
  for (const identifier in routes) {
    const routeItem = createRouteList({
      route: routes[identifier],
      onSelected: props.onRouteItemSelected,
    });
    routesList.push(routeItem);
  }
  props.navElement.append(...routesList);
  // load
  props.onRouterLoaded?.(routesList);
};

