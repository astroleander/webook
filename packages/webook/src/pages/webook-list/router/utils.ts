import { FragmentFactory } from "../fragment";
import type { ModuleLoader, ModuleParser, RouterItem } from "./types";

export const loadFragmentFromRouter = async (router: RouterItem) => {
  // TODO: add default module setter
  const { load, default_module , identifier, ...params } = router;
  try {
    const module = await load();  
    const key_of_first_child = Object.keys(module)?.[0];
    const fragment = await FragmentFactory.create({
      module: module[default_module] || module[key_of_first_child],
      identifier: identifier,
      params: {
        github_page_link: params.github_page_link
      }
    });
    return fragment;
  } catch (err) {
    const error_fragment = await FragmentFactory.create({
      identifier: `webook.error.${identifier}`,
      module: {
        error: err,
        module_name: identifier,
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
  setPrefix: (prefix: string) => function(moduleId, module) {
    return {
      moduleId: `${prefix}.${moduleId}`,
      module: module,
    }
  },
}
export const Parser: Record<string, ModuleParser> = {
  raw: function(moduleId, module) {
    return {
      moduleId,
      module
    };
  },
  glob: function(moduleId, module) {
    return {
      moduleId,
      module
    };
  },
}
