import { LabelFactory } from "./label/Label";
import { Parser, splitRouteIdentifier } from "./utils";
import type { ModuleObject, ModuleParser, RouterOptions, RoutesCallback } from "./types";

const repo_url = 'https://github.com/astroleander/webook/blob/main';

export class Router {
  navElement: Element | null = null;
  routerList: ModuleObject[] = [];
  // callback hooks
  onItemSelected?: RoutesCallback['onItemSelected'];
  // cycle hooks
  onRouterLoaded?: RoutesCallback['onRouterLoaded'];
  constructor(navElement: Element | null, options: RouterOptions) {
    this.navElement = navElement;
    this.onItemSelected = options?.onItemSelected;
    this.onRouterLoaded = options?.onRouterLoaded;
  }
  #createRouterElement(routes: ModuleObject[]) {
    const routerList = [] as Array<HTMLElement>;
    for (const route of routes) {
      const li = document.createElement('li');
      li.setAttribute('identifier', route.moduleName);
      const { type, sub_type, name } = splitRouteIdentifier(route.moduleName);
      li.appendChild(LabelFactory.create(type));
      sub_type && li.appendChild(LabelFactory.create(sub_type));
      li.append(name || '');
      li.onclick = (e) => this.onItemSelected?.(route);
      routerList.push(li);
    }
    return routerList;
  }
  #createRouterObject(module: ModuleObject) {
    // e.g. `webrary/react/hooks/useTimer/index.tsx` from `import("./webook/webrary/react/hooks/useTimer/index.tsx")`
    return {
      ...module,
      nav: module.moduleName.split('.'),
      // github_page_link: `${repo_url}${key}`,
    } as ModuleObject;
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
    const routerObjects: ModuleObject[] = [];
    for (const rawKey in routes) {
      if (Array.isArray(parser)) {
        const modulePair = parser.reduce<ModuleObject>((reducedRouter, nextParser) => {
          return nextParser(reducedRouter);
        }, { moduleName: rawKey, moduleLoader: routes[rawKey] });
        routerObjects.push(this.#createRouterObject(modulePair));
      } else {
        routerObjects.push(this.#createRouterObject(parser({
          moduleName: rawKey,
          moduleLoader: routes[rawKey],
        })));
      }
    }
    this.routerList.push(...routerObjects);

    const routerElements = this.#createRouterElement(routerObjects);
    this.navElement?.append(...routerElements);
    this.onRouterLoaded?.(routerObjects, routerElements);
  }
}