type Route = {
  load: () => Promise<any>;
  default_path: string;
}
export const renameRoutesWithDomain = (
  routes: Record<string, () => Promise<any>>,
  domain: string,
  default_path: string = 'default'
) => {
  const renamed_routes = {} as Record<string, Route>;
  for (const key in routes) {
    renamed_routes[`${domain}.${key}`] = {
      load: routes[key],
      default_path,
    };
  }
  return renamed_routes;
}
