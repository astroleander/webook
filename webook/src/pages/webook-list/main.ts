import './index.less';
import './fragment/styles/index.less';

import { initRouter, loadFragmentFromRoute } from './routes';
import type { Route } from './routes';

import { initMenu } from './menu';

const DEBUG = true;

/** select <nav/> & <main/> element from document */
const [nav, main, menu] = [
  document.querySelector('body nav'),
  document.querySelector('body main'),
  document.querySelector('body menu'),
];

initRouter({
  __debug: DEBUG,
  navElement: nav,
  onRouteItemSelected: async (route: Route) => {
    const fragment = await loadFragmentFromRoute(route);
    fragment && main?.appendChild(fragment);
  },
  onRouterLoaded: (routes: HTMLElement[]) => {
    const open_pattern = /react\.hooks\.*/; 
    for (const element of routes) {
      if (element.getAttribute('identifier')?.match(open_pattern)) element.click();
    }
  }
});

initMenu({
  __debug: DEBUG,
  menuElement: menu,
});