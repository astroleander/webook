import { LabelFactory } from './label/Label'
import { Parser, splitRouteIdentifier } from './utils'
import type {
  ModuleObject,
  ModuleParser,
  RouterOptions,
  RoutesCallback,
} from './types'

const repo_url = 'https://github.com/astroleander/webook/blob/main'

interface RecursiveRoutes {
  [x: string]: RecursiveRoutes | (() => Promise<any>);
}
export class Router {
  navElement: Element | null = null
  routerList: ModuleObject[] = []
  // callback hooks
  onItemSelected?: RoutesCallback['onItemSelected']
  // cycle hooks
  onRouterLoaded?: RoutesCallback['onRouterLoaded']

  constructor(navElement: Element | null, options: RouterOptions) {
    this.navElement = navElement
    this.onItemSelected = options?.onItemSelected
    this.onRouterLoaded = options?.onRouterLoaded
  }

  #createRouterElement(routes: ModuleObject[]) {
    const routerList = [] as Array<HTMLElement>
    for (const route of routes) {
      const li = document.createElement('li')
      li.setAttribute('identifier', route.moduleName)
      if (route.nav) {
        route.nav.forEach((type, index) => {
          route.nav?.length !== index + 1
            ? li.appendChild(LabelFactory.create(type))
            : li.append(type)
        })
      } else {
        const { type, sub_type, name } = splitRouteIdentifier(route.moduleName)
        li.appendChild(LabelFactory.create(type))
        sub_type && li.appendChild(LabelFactory.create(sub_type))
        li.append(name || '')
      }
      li.onclick = (e) => this.onItemSelected?.(route)
      routerList.push(li)
    }
    return routerList
  }
  addRecursiveModuleRoutes(
    recursiveRoutes: RecursiveRoutes,
    parser: ModuleParser | ModuleParser[] = Parser.raw,
  ) {
    for (const key in recursiveRoutes) {
      if (typeof recursiveRoutes[key] === 'function') {
        // console.log('function->',recursiveRoutes)
        this.addModuleRoutes(recursiveRoutes as Record<string, () => Promise<any>>, parser);
        return;
      } else if (typeof recursiveRoutes[key] === 'object') {
        // console.log('object->',recursiveRoutes[key])
        this.addRecursiveModuleRoutes(recursiveRoutes[key] as RecursiveRoutes, parser);
      }
    }
    // create parent
  }
  addModuleRoutes(
    routes: Record<string, () => Promise<any>> | undefined,
    parser: ModuleParser | ModuleParser[] = Parser.raw,
  ) {
    const routerObjects: ModuleObject[] = [];
    for (const rawKey in routes) {
      if (Array.isArray(parser)) {
        const processedModuleObject = parser.reduce<ModuleObject>(
          (reducedRouter, nextParser) => {
            return nextParser(reducedRouter)
          },
          { moduleName: rawKey, moduleLoader: routes[rawKey] },
        )
        routerObjects.push(processedModuleObject)
      } else {
        routerObjects.push(
          parser({
            moduleName: rawKey,
            moduleLoader: routes[rawKey],
          }),
        )
      }
    }

    this.routerList.push(...routerObjects);

    const routerElements = this.#createRouterElement(routerObjects)
    this.navElement?.append(...routerElements)
    this.onRouterLoaded?.(routerObjects, routerElements)
  }
}
