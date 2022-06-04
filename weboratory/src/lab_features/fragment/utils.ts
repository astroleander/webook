/**
 * @param keyfactors [wrapper_type, module_type, name, categories]
 * @returns `wrapper_type::module_type::name::categories`, if un-exist, replace with *
 */
export const mapKey = (...keyfactors: (string | null | undefined)[]): string | null => {
  return new Array(4).fill(null).flatMap((_, idx) => keyfactors[idx] || '*').join('::');
}