import { FragmentFactory } from "../fragment";
import type { ModuleLoader, ModuleObject, ModuleParser, RouterItem } from "./types";

const moduleObjectToRouterItem = (moduleObject: ModuleObject): RouterItem  => {
  return {
    ...moduleObject,
  } as RouterItem;
}

export const loadFragmentFromRouter = async (moudleObject: ModuleObject) => {
  const { moduleName, moduleLoader, defaultModule, ...params } = moudleObject;
  try {
    const module = await moduleLoader();  
    const key_of_first_child = Object.keys(module)?.[0];
    const fragment = await FragmentFactory.create({
      ...moudleObject,
      nav: moduleName.split('.'),
      module: module?.[defaultModule || key_of_first_child],
      params: {

        github_page_link: params.github_page_link
      }
    } as RouterItem);
    return fragment;
  } catch (err) {
    const error_fragment = await FragmentFactory.create({
      ...moudleObject,
      nav: moduleName.split('.'),
      module: {
        error: err,
        module_name: moduleName,
      },
      params: {}
    });
    return error_fragment;
  }
}

export const splitRouteIdentifier = (identifier: string) => {
  const parts = identifier.split('.');
  return {
    type: parts[0],
    sub_type: parts.length - 1 === 1 ? undefined : parts[1],
    name: parts.at(-1),
    categories: parts,
    raw: identifier,
  }
}
export const ParserBuilder: Record<string, ((x: any) => ModuleParser)> = {
  setPrefix: (prefix: string) => function(module) {
    return {
      ...module,
      moduleName: `${prefix}.${module.moduleName}`,
    }
  },
  setDefaultModule: (defaultModuleName: string) => function(module) {
    return {
      ...module,
      defaultModule: defaultModuleName,
    }
  },
}
export const Parser: Record<string, ModuleParser> = {
  raw: function(module) {
    return {
      ...module
    };
  },
  glob: function(module) {
    return {
      ...module
    };
  },
}
