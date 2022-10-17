import './styles/index.less';
import './fragment/styles/index.less';

import { initMenu } from './menu';
import { rudeDarkMode } from './utils';
import { initRouter, loadFragmentFromRouter, RouterItem } from './router';

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
  options: {
    onItemSelected: async (item: RouterItem) => {
      const fragment = await loadFragmentFromRouter(item);
      fragment && main?.appendChild(fragment);
    },
    onRouterLoaded(objectList: RouterItem[], elementList: HTMLElement[]) {
      objectList.forEach(route => {
        if (route.identifier.includes('react')) {
          this.onItemSelected?.(route);
        }
      });
    },
  }
})

initMenu({
  __debug: DEBUG,
  menuElement: menu,
});

rudeDarkMode();