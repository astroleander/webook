import { LabelFactory } from "./label/Label";
import { Parser, splitRouteIdentifier } from "./utils";
import type { ModuleObject, ModuleParser, RouterItem, RouterOptions, RoutesCallback } from "./types";

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
  #createRouterObject({moduleId, module}: ModuleObject) {
    // e.g. `webrary/react/hooks/useTimer/index.tsx` from `import("./webook/webrary/react/hooks/useTimer/index.tsx")`
    return {
      identifier: moduleId,
      load: module,
      nav: moduleId.split('.'),
      // github_page_link: `${repo_url}${key}`,
    } as RouterItem;
  }
  addModuleRoutesAsync(prosime: any, options: any) {
    prosime.then((m: any) => {
      const { modules, name } = m;
      // this.addModuleRoutes(modules, { prefix: name, name })
    })
  }
  addModuleRoutes(
    routes: Record<string, () => Promise<any>> | undefined,
    parser: ModuleParser | ModuleParser[] = Parser.raw,
  ) {
    const routerObjects: RouterItem[] = [];
    for (const rawKey in routes) {
      if (Array.isArray(parser)) {
        const modulePair = parser.reduce<ModuleObject>((prev, nextParser) => {
          return nextParser(prev.moduleId, prev.module);
        }, {moduleId: rawKey, module: routes[rawKey]});
        const moduleObject = this.#createRouterObject(modulePair);
        routerObjects.push(moduleObject);
      } else {
        const moduleObject = this.#createRouterObject(parser(rawKey, routes[rawKey]));
        routerObjects.push(moduleObject);
      }
    }
    this.routerList.push(...routerObjects);

    const routerElements = this.#createRouterElement(routerObjects);
    this.navElement?.append(...routerElements);
    this.onRouterLoaded?.(routerObjects, routerElements);
  }
}