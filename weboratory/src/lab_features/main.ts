import './index.less';
import './fragment/styles/index.less';

import { initRouter, loadFragmentFromRoute } from './routes';
import type { Route } from './routes';

/** select <nav/> & <main/> element from document */
const [nav, main] = [
  document.querySelector('body nav'),
  document.querySelector('body main'),
];

initRouter({
  __debug: true,
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
