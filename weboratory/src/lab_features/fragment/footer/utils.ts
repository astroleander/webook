import * as PairRenders from "./PairRenders";


export const selectPairRender = (key: string) => {
  return foot_component_list[key as keyof typeof foot_component_list] ?? foot_component_list['default'];
}

export const generateMetaRecordsFooter = (records: Record<string, string>) => {
  return Object.keys(records).map(meta_name => {
    const fn = selectPairRender(meta_name);
    return fn(meta_name, records[meta_name]) || '';
  })
};

export const foot_component_list = {
  'github_page_link': PairRenders.createGithubLinkPair,
  'default': PairRenders.createNormalSpanPair,
}

