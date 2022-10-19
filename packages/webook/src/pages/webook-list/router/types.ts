export type ModuleId = string;
export type ModuleLoader = () => Promise<any>;
export type ModuleObject = {
  moduleId: ModuleId,
  module: ModuleLoader,
};
export type ModuleParser = (moduleId: ModuleId, module: ModuleLoader) => ModuleObject;

export type RouterItem = {
  identifier: string;
  // functional
  load: () => Promise<any>;
  // nav
  nav: string[];
  // extras
  github_page_link?: string;
}

export type RouterOptions = {} 
  & RoutesCallback;

export type RoutesCallback = {
  onItemSelected?: (route: RouterItem) => void;
  onRouterLoaded?: (routesList: RouterItem[], routerList: HTMLElement[]) => void;
}
