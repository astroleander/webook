import { FragmentFactory } from "../fragment";
import type { ModuleObject, ModuleParser } from "./types";

export const loadFragmentFromRouter = async (moduleObject: ModuleObject) => {
  console.log('[loadFragmentFromRouter]', moduleObject)
  const fragment = await FragmentFactory.create(moduleObject);
  return fragment;

  // const error_fragment = await FragmentFactory.create({
  //   ...moduleObject,
  //   nav: nav ?? moduleName.split('/'),
  //   module: {
  //     error: err,
  //     module_name: moduleName,
  //   },
  //   params: {}
  // });
}

export const splitRouteIdentifier = (identifier: string) => {
  const parts = identifier.split('/');
  return {
    type: parts[0],
    sub_type: parts.length - 1 === 1 ? undefined : parts[1],
    name: parts.at(-1),
    categories: parts,
    raw: identifier,
  }
}

export const ParserBuilder: Record<string, ((...props: any[]) => ModuleParser)> = {
  setPrefix: (prefix: string, navSetter?: (x: string) => string[]) => function (module) {
    const modulename = `${prefix}/${module.moduleName}`;
    return {
      ...module,
      moduleName: modulename,
      nav: navSetter ? [prefix, ...navSetter(module.moduleName)] : modulename.split('/'),
    }
  },
  setDefaultModule: (defaultModuleName: string) => function (module) {
    return {
      ...module,
      defaultModule: defaultModuleName,
    }
  },
};

export const Parser: Record<string, ModuleParser> = {
  raw: function (module) {
    const addons = {} as any;
    if (__BUILD__ === 'vite') {
      addons.moduleName = module.moduleName.replace('./', '');
    }
    return {
      ...module,
      ...addons,
    };
  },
  leetcode: function (module) {
    return { ...(module.moduleLoader()) } as any as ModuleObject;
  }
}
