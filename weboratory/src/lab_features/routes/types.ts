export type Route = {
  identifier: string;
  // functional
  load: () => Promise<any>;
  default_module: string;
  // nav
  nav: string[];
  // extras
  github_page_link?: string;
}