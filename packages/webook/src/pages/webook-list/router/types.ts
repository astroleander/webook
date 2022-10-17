export type RouterItem = {
  identifier: string;
  // functional
  load: () => Promise<any>;
  default_module: string;
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