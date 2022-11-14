import { ModuleManager } from "./loader";
import { ModuleType } from "./types";

export class LeetCodeModuleManager implements ModuleManager {
  // param
  _type: string;
  _module: any;
  _meta?: Record<string, string>;
  // public internal
  mount: () => void = () => {};
  unmount: () => void = () => {};

  func: any;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
  parent: Element;
  
  constructor(module: any, parent: Element, type: string = ModuleType.LEETCODE) {
    this._type = type;
    this._module = module;
    this.parent = parent; 
  }

  loadModule = async () => {
    this.mount = () => {
      console.log(this.module)
      this.parent
    }
    this.unmount = () => {

    }
    this._meta = {}
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