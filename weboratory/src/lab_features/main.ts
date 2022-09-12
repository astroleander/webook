import { FragmentFactory } from './fragment';
import './index.less';
import './fragment/styles/index.less';

import { routes } from './routes';

const open_pattern = /react\.hooks\.*/;

const [nav, main] = [
  document.querySelector('body nav'),
  document.querySelector('body main'),
];

const routesList = [] as Array<HTMLElement>;

const addToRoutesList = (module_name: string) => {
  const li = document.createElement('li');
  li.innerHTML = module_name;
  li.onclick = () => {
    const { load, default_module, ...params } = routes[module_name];
    load().then(async module => {
      const key = Object.keys(module)?.[0];
      const fragment = await FragmentFactory.create({
        module: module[default_module] || module[key],
        identifier: module_name,
        params: {
          github_page_link: params.github_page_link
        }
      });
      fragment && main?.appendChild(fragment);
      // TODO: seprecated create routes & route-view  
    }).catch(async (err) => {
      const fragment = await FragmentFactory.create({
        identifier: `webook.error.${module_name}`,
        module: {
          error: err,
          module_name,
        },
        params: {}
      });
      fragment && main?.appendChild(fragment);
    });
  }
  if (module_name.match(open_pattern)) li.click();
  routesList.push(li);
}

for (const module_name in routes) {
  addToRoutesList(module_name);
}
nav?.append(...routesList);
console.log('[main.ts/routes]', routes);