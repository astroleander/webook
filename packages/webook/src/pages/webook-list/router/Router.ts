import { LabelFactory } from "./label/Label";
import { splitRouteIdentifier } from "./utils";
import type { RouterItem, RouterOptions, RoutesCallback } from "./types";

const repo_url = 'https://github.com/astroleander/webook/blob/main';

export class Router {
  navElement: Element | null = null;
  routerList: RouterItem[] = [];
  // callback hooks
  onItemSelected?: RoutesCallback['onItemSelected'];
  // cycle hooks
  onRouterLoaded?: RoutesCallback['onRouterLoaded'];
  constructor(navElement: Element | null, options: RouterOptions) {
    this.navElement = navElement;
    this.onItemSelected = options?.onItemSelected;
    this.onRouterLoaded = options?.onRouterLoaded;
  }
  #createRouterElement(routes: RouterItem[]) {
    const routerList = [] as Array<HTMLElement>;
    for (const route of routes) {
      const li = document.createElement('li');
      li.setAttribute('identifier', route.identifier);
      const {type, sub_type, name} = splitRouteIdentifier(route.identifier);
      li.appendChild(LabelFactory.create(type));
      sub_type && li.appendChild(LabelFactory.create(sub_type));
      li.append(name || '');
      li.onclick = (e) => this.onItemSelected?.(route);
      routerList.push(li);
    }
    return routerList;
  }
  #createRouterObject(
    routes: Record<string, () => Promise<any>> | undefined,
    options: {
      prefix: string;
      default?: string;
      name?: string;
    }
  ) {
    const routesList: RouterItem[] = [];
    for (const key in routes) {
      // e.g. `webrary/react/hooks/useTimer/index.tsx` from `import("./webook/webrary/react/hooks/useTimer/index.tsx")`
      const file_path = options.name
        ? key.replace('./', '')
        : routes?.[key]?.toString()?.match(/import\(.*webook(.*)['|"]\)/)?.[1];

      const id = options.name
        ? options.name
        : key;

      routesList.push({
        identifier: `${options.prefix}.${id}`,
        load: routes[key],
        default_module: options.default || 'default',
        nav: [options.prefix.split('.'), id].flat(1),
        github_page_link: `${repo_url}${file_path}`,
      });
    }
    return routesList;
  }
  addModuleRoutesAsync() {

  }
  addModuleRoutes(
    routes: Record<string, () => Promise<any>> | undefined,
    options: {
      prefix: string;
      default?: string;
      name?: string;
    }
  ) {
    const routerObjects = this.#createRouterObject(routes, options);
    this.routerList.push(...routerObjects);
    const routerElements = this.#createRouterElement(routerObjects);
    this.navElement?.append(...routerElements);
    this.onRouterLoaded?.(routerObjects, routerElements);
  }
}