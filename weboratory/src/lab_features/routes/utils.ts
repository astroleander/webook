import { FragmentFactory } from "../fragment";
import type { Route } from "./types";

const repo_url = 'https://github.com/astroleander/webook/blob/main';

export const renameRoutesWithDomain = (
  routes: Record<string, () => Promise<any>>,
  domain: string,
  default_module: string = 'default'
) => {
  const renamed_routes = {} as Record<string, Route>;
  for (const key in routes) {
    // extract path string from import expression
    // e.g. `webrary/react/hooks/useTimer/index.tsx` from `import("./webook/webrary/react/hooks/useTimer/index.tsx")`
    const file_path = routes?.[key]?.toString()?.match(/import\(.*webook(.*)['|"]\)/)?.[1]
    // create routes as Route[]
    renamed_routes[`${domain}.${key}`] = {
      identifier: `${domain}.${key}`,
      load: routes[key],
      default_module: default_module,
      nav: [domain.split('.'), key].flat(1),
      github_page_link: `${repo_url}${file_path}`,
    };
  }
  return renamed_routes;
}

export const loadFragmentFromRoute = async (route: Route) => {
  const { load, default_module, identifier, ...params } = route;
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

export const createRouterItem = (props: {
  route: Route;
  onSelected?: (route: Route) => void;
}) => {
  const li = document.createElement('li');
  li.innerHTML = props.route.identifier;
  li.onclick = (e) => props.onSelected?.(props.route);
  li.setAttribute('identifier', props.route.identifier);
  return li;
}