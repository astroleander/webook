export type ModuleName = string;
export type ModuleLoader = () => Promise<any>;
export type ModuleObject = {
  moduleName: ModuleName;
  moduleLoader: ModuleLoader;
  moduleRaw?: ModuleLoader;
  //
  nav?: string[];
  defaultModule?: string;
  // extras
  github_page_link?: string;
};
export type ModuleParser = (module: ModuleObject) => ModuleObject;

export type RouterOptions = {} 
  & RoutesCallback;

export type RoutesCallback = {
  onItemSelected?: (route: ModuleObject) => void;
  onRouterLoaded?: (routesList: ModuleObject[], routerList: HTMLElement[]) => void;
}
