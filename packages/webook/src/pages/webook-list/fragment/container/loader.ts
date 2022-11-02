import { ReactModuleManager } from './ReactModuleManager';
import { SvelteModuleManager } from './SvelteModuleManager';
import { WebookModuleManager } from './WebookModuleManager';
import { RNModuleManager } from './RNModuleManager';
import { VueModuleManager } from './VueModuleManager';
import { SolidModuleManager } from './SolidModuleManager';

export enum ModuleType {
  REACT_DOM = 'react-dom',
  REACT = 'react',
  RN = 'rn',
  SVELTE = 'svelte',
  WEBOOK = 'webook',
  VUE = 'vue',
  SOLID = 'solid',
  LEETCODE = 'leetcode',
}

export interface ModuleManager {
  type: ModuleType[keyof ModuleType];
  module: any;
  meta?: Record<string, string>;
  mount: () => void;
  unmount: () => void;
}

export const ModuleManagerSelector: Record<ModuleType, (m: any, parent: Element) => Promise<ModuleManager>> = {
  [ModuleType.REACT_DOM]: async (m, p) => {
    const controller = new ReactModuleManager(m, p, ModuleType.REACT_DOM)
    await controller.loadModule();
    return controller;
  },
  [ModuleType.REACT]: async (m, p) => {
    const controller = new ReactModuleManager(m, p, ModuleType.REACT)
    await controller.loadModule();
    return controller;
  },
  [ModuleType.RN]: async (m, p) => {
    const controller = new RNModuleManager(m, p, ModuleType.RN)
    await controller.loadModule();
    return controller;
  },
  [ModuleType.SVELTE]: async (m, p) => {
    const controller = new SvelteModuleManager(m, p, ModuleType.SVELTE);
    await controller.loadModule();
    return controller;
  },
  // internal type
  [ModuleType.WEBOOK]: async (m, p) => {
    const c = new WebookModuleManager(m, p, ModuleType.WEBOOK);
    await c.loadModule();
    return c;
  },
  [ModuleType.VUE]: async (m, p) => {
    const c = new VueModuleManager(m, p, ModuleType.VUE);
    await c.loadModule();
    return c;
  },
  [ModuleType.SOLID]: async (m, p) => {
    const c = new SolidModuleManager(m, p, ModuleType.SOLID);
    await c.loadModule();
    return c;
  },
  [ModuleType.LEETCODE]: async (m, p) => {
    console.log(m)
    console.log(m)
    console.log(m)
    const controller = new SvelteModuleManager(m, p, ModuleType.SVELTE);
    await controller.loadModule();
    return controller;
  },
};

export const getModuleTypeFromIdentifier = (identifier: string) => {
  // TODO: add fallback
  return identifier.split('.')[0] as ModuleType;
}