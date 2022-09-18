import { FragmentFactory } from "../fragment";

type Route = {
  // functional
  load: () => Promise<any>;
  default_module: string;
  // nav
  nav: string[];
  // extras
  github_page_link?: string;
}
const repo_url = 'https://github.com/astroleander/webook/blob/main';

export const renameRoutesWithDomain = (
  routes: Record<string, () => Promise<any>>,
  domain: string,
  default_module: string = 'default'
) => {
  const renamed_routes = {} as Record<string, Route>;
  for (const key in routes) {
    // unstable functions
    // translate from dynamic import string compile generations
    const file_path = routes?.[key]?.toString()?.match(/import\(.*webook(.*)['|"]\)/)?.[1]
    renamed_routes[`${domain}.${key}`] = {
      load: routes[key],
      default_module: default_module,
      nav: [domain.split('.'), key].flat(1),
      github_page_link: `${repo_url}${file_path}`,
    };
  }
  return renamed_routes;
}

export const loadFragmentFromRoute = (props: {
  identifier: string,
  route: Route,
  element: Element | null,
}) => {
  const { load, default_module, ...params } = props.route;
  load().then(async module => {
    const key = Object.keys(module)?.[0];
    const fragment = await FragmentFactory.create({
      module: module[default_module] || module[key],
      identifier: props.identifier,
      params: {
        github_page_link: params.github_page_link
      }
    });
    fragment && props.element?.appendChild(fragment);
    // TODO: seprecated create routes & route-view  
  }).catch(async (err) => {
    const fragment = await FragmentFactory.create({
      identifier: `webook.error.${props.identifier}`,
      module: {
        error: err,
        module_name: props.identifier,
      },
      params: {}
    });
    fragment && props.element?.appendChild(fragment);
  });

}