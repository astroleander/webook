import { ModuleManager } from "./loader";

type VueApp = any;

export class VueModuleManager implements ModuleManager {
  // param
  _type: string;
  _module: any;
  _meta?: Record<string, string>;
  // public internal
  mount: () => void = () => {};
  unmount: () => void = () => {};

  app: VueApp;
  parent: Element;

  constructor(module: any, parent: Element, type: string) {
    this._type = type;
    this._module = module;
    this.parent = parent;
  }

  loadModule = async () => {
    return await Promise.all([
      import('vue'),
    ]).then(([Vue]) => {
      this.mount = () => {
        this.app = Vue.createApp(this._module);
        this.app.mount(this.parent);
      };
      this.unmount = () => {
        this.app?.unmount();
        this.app = null;
      };

      this._meta = {
        'vue version': Vue.version,
      }
    })
  }

  updateModule = this.loadModule;

  set type(_v: string) {
    console.warn('Can\'t set type once initialized')
  }
  set module(_v: any) {
    console.warn('Can\'t set module once initialized')
  }
  set meta(_map: Record<string, string>) {
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