import './index.less';
import './fragment/styles/index.less';

import { loadFragmentFromRoute } from './routes/utils';
import { routes } from './routes';

const open_pattern = /react\.hooks\.*/;

const [nav, main] = [
  document.querySelector('body nav'),
  document.querySelector('body main'),
];

const routesList = [] as Array<HTMLElement>;

const addToRoutesList = (identifier: string) => {
  const li = document.createElement('li');
  li.innerHTML = identifier;
  li.onclick = () => {
    loadFragmentFromRoute({
      route: routes[identifier],
      identifier: identifier,
      element: main,
    });
  }
  if (identifier.match(open_pattern)) li.click();
  routesList.push(li);
}

for (const identifier in routes) {
  addToRoutesList(identifier);
}
nav?.append(...routesList);
console.log('[main.ts/routes]', routes);
