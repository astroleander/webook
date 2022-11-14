import { ModuleManager } from './loader';
import { ModuleType } from './types';

type AppRoot = any;

export class SvelteModuleManager implements ModuleManager {
  // param
  _type: string;
  _module: any;
  _meta?: Record<string, string>;
  static svelte_version: string | null = null;
  // public internal
  mount: () => void = () => {};
  unmount: () => void = () => {};

  root: AppRoot;
  parent: Element;
  
  constructor(module: any, parent: Element, type: string = ModuleType.SVELTE) {
    this._type = type;
    this._module = module;
    this.parent = parent; 
  }

  loadModule = async () => {
    SvelteModuleManager.svelte_version ?? (await import('svelte/compiler').then(compiler => {
      const v =  compiler.VERSION;
      SvelteModuleManager.svelte_version = v
    }))
    this._meta = {
      'svelte version': SvelteModuleManager.svelte_version ?? '',
    }
    const App = this.module as any;
    // App.
    // Manager scripts
    this.mount = () => {
      this.root = new App({
        target: this.parent
      })
    }
    this.unmount = () => {
      this.root.$destroy();
      this.root = null;
    };
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