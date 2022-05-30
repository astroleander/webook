import { ReactModuleManager } from './ReactModuleManager';
import { SvelteModuleManager } from './SvelteModuleManager';

export enum ModuleType {
  REACT_DOM = 'react-dom',
  REACT = 'react',
  SVELTE = 'svelte',
}

export interface ModuleManager {
  type: ModuleType[keyof ModuleType];
  module: any;
  meta: Record<string, string>;
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
    const controller = new ReactModuleManager(m, p, ModuleType.REACT_DOM)
    await controller.loadModule();
    return controller;
  },
  [ModuleType.SVELTE]: async (m, p) => {
    const controller = new SvelteModuleManager(m, p, ModuleType.SVELTE);
    await controller.loadModule();
    return controller;
  }
};

export const getModuleTypeFromIdentifier = (identifier: string) => {
  // TODO: add fallback
  return identifier.split('.')[0] as ModuleType;
}