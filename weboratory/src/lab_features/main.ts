import { FragmentFactory } from './fragment';
import './index.less';
import './fragment/styles/index.less';

import { routes } from './routes';

const [nav, main] = [
  document.querySelector('body nav'),
  document.querySelector('body main'),
];

const routesList = [] as Array<Element>;

const addToRoutesList = (module_name: string) => {
  const li = document.createElement('li');
  li.innerHTML = module_name;
  li.onclick = () => {
    const {load, default_path: path} = routes[module_name];
    load().then(async module => {
      const fragment = await FragmentFactory.create({
        module: module[path],
        identifier: module_name
      });
      fragment && main?.appendChild(fragment);
      // TODO: seprecated create routes & route-view
    });
  }
  routesList.push(li);
}

for (const module_name in routes) {
  addToRoutesList(module_name);
}
nav?.append(...routesList);
console.log('[main.ts/routes]', routes);