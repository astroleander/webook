import { ModuleManager } from './loader';
import { ModuleType } from './types';

type SolidJSRoot = any;

export class SolidModuleManager implements ModuleManager {
  // param
  _type: string;
  _module: any;
  _meta?: Record<string, string>;
  // public internal
  mount: () => void = () => {};
  unmount: () => void = () => {};
  
  root: SolidJSRoot;
  parent: Element;

  constructor(module: any, parent: Element, type: string = ModuleType.SOLID) {
    this._type = type;
    this._module = module;
    this.parent = parent; 
  }

  loadModule = async () => {
    return await Promise.all([
      import('solid-js'),
      import('solid-js/web')
    ]).then(([Solid, SolidWeb]) => {
      // Manager scripts
      this.mount = () => {
        // dynamic imported solid would require a structure like this:
        // {
        //   _Hot$$<name>: {
        //      component, name
        //   } 
        // }
        const key_of_first_child = Object.keys(this.module)?.[0];
        SolidWeb.render(this.module[key_of_first_child].component, this.parent);
      }
      this.unmount = () => {

      };
      this._meta = {
      }
    })
  }

  updateModule = this.loadModule

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