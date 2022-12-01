import { ModuleManager } from './loader';

type ReactRoot = any;

export class RNModuleManager implements ModuleManager {
  // param
  _type: string;
  _module: any;
  _meta?: Record<string, string>;
  // public internal
  mount: () => void = () => {};
  unmount: () => void = () => {};

  root: ReactRoot;
  parent: Element;
  
  constructor(module: any, parent: Element, type: string) {
    this._type = type;
    this._module = module;
    this.parent = parent; 
  }

  loadModule = async () => {
    return await Promise.all([
      import('react'),
      import('react-dom/client'),
      // @ts-ignore dynamic import doesn't support alias
      import('react-native-web'),
    ]).then(([React, ReactDOM, _RN]) => {
      // Manager scripts
      // RN.render === ReactDOM.render, which is not supported by React 18
      this.mount = () => {
        this.root = ReactDOM.createRoot(this.parent);
        const module = React.createElement(this.module, {});
        this.root.render(module);
      }
      this.unmount = () => {
        this.root?.unmount();
        this.root = null;
      };
      this._meta = {
        'react version': React.version,
        'React Native': 'react-native-web',
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