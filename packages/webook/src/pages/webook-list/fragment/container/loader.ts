import { ReactModuleManager } from './ReactModuleManager';
import { SvelteModuleManager } from './SvelteModuleManager';
import { WebookModuleManager } from './WebookModuleManager';
import { RNModuleManager } from './RNModuleManager';
import { VueModuleManager } from './VueModuleManager';
import { SolidModuleManager } from './SolidModuleManager';
import { LeetCodeModuleManager } from './LeetCodeModuleManager';
import { ModuleType } from './types';
export interface ModuleManager {
  module: any;
  type?: string;
  meta?: Record<string, string>;
  mount: () => void;
  unmount: () => void;
}

export const ModuleManagerSelector: Record<ModuleType, (m: any, parent: Element, options?: Record<string, any>) => Promise<ModuleManager>> = {
  [ModuleType.REACT_DOM]: async (m, p) => {
    const controller = new ReactModuleManager(m, p)
    await controller.loadModule();
    return controller;
  },
  [ModuleType.REACT]: async (m, p) => {
    const controller = new ReactModuleManager(m, p)
    await controller.loadModule();
    return controller;
  },
  [ModuleType.RN]: async (m, p) => {
    const controller = new RNModuleManager(m, p)
    await controller.loadModule();
    return controller;
  },
  [ModuleType.SVELTE]: async (m, p) => {
    const controller = new SvelteModuleManager(m, p);
    await controller.loadModule();
    return controller;
  },
  // internal type
  [ModuleType.WEBOOK]: async (m, p) => {
    const c = new WebookModuleManager(m, p);
    await c.loadModule();
    return c;
  },
  [ModuleType.VUE]: async (m, p) => {
    const c = new VueModuleManager(m, p);
    await c.loadModule();
    return c;
  },
  [ModuleType.SOLID]: async (m, p) => {
    const c = new SolidModuleManager(m, p);
    await c.loadModule();
    return c;
  },
  [ModuleType.LEETCODE]: async (m, p) => {
    const controller = new LeetCodeModuleManager(m, p);
    await controller.loadModule();
    return controller;
  },
};

export const getModuleTypeFromIdentifier = (identifier: string) => {
  // TODO: add fallback
  return identifier as ModuleType;
}