export const renameRoutesWithDomain = (routes: Record<string, () => Promise<any>>, domain: string) => {
  const renamed_routes = {} as Record<string, () => Promise<any>>;
  for (const key in routes) {
    renamed_routes[`${domain}.${key}`] = routes[key];
  }

  return renamed_routes;
}
