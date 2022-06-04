import { ModuleManager } from './loader';

type AppRoot = any;

export class WebookModuleManager implements ModuleManager {
  // param
  _type: string;
  _module: any;
  _meta?: Record<string, string>;
  // public internal
  mount: () => void = () => {};
  unmount: () => void = () => {};

  root: AppRoot;
  parent: Element;
  
  constructor(module: any, parent: Element, type: string) {
    this._type = type;
    this._module = module;
    this.parent = parent;
  }

  loadModule = async () => {
    const code = document.createElement('code');
    const {error, ...others} = this.module;
    code.innerHTML = error.toString();
    this.parent.replaceChildren(code);
    this._meta = others;
    this.mount = () => {}
    this.unmount = () => {};
  }

  updatModule = this.loadModule

  set type(v: string) {
    console.warn('Can\'t set type once initialized')
  }
  set module(v: any) {
    console.warn('Can\'t set module once initialized')
  }
  set meta(map: Record<string, string>) {
    console.warn('Can\'t set module from outside')
  }
  get type() {
    return this._type;
  }
  get module() {
    return this._module;
  }
  get meta() {
    return this._meta || {};
  }
}