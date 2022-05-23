import { ReactModuleManager } from './ReactModuleManager';

export enum ModuleType {
  REACT_DOM = 'react-dom'
}

export interface ModuleManager {
  type: ModuleType[keyof ModuleType];
  module: any;
  meta: Record<string, string>;
  mount: () => void;
  unmount: () => void;
}

export const ModuleManagerSelector: Record<string, (m: any, parent: Element) => Promise<ModuleManager>> = {
  [ModuleType.REACT_DOM]: async (m, p) => {
    // TODO: async new
    const controller = new ReactModuleManager(m, p, ModuleType.REACT_DOM)
    await controller.loadModule();
    return controller;
  }
};