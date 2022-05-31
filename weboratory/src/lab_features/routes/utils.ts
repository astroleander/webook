type Route = {
  load: () => Promise<any>;
  default_module: string;
  github_page_link?: string;
}
const repo_url = 'https://github.com/astroleander/webook/blob/main'
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
      default_module,
      github_page_link: `${repo_url}${file_path}`
    };
  }
  return renamed_routes;
}
