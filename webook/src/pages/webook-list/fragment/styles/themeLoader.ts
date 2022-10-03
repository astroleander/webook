/**
 * - fragment-wrapper
 *   - fragment-header + header
 *     - button
 *     - button-close
 *     - button-refresh
 *     - button-collapsed
 *     - title
 *   - fragment-container + container
 *   - fragment-footer
 *     - meta-value
 *     - meta-key
 */

/**
 * loadTheme
 * fetch modulized style from template classname
 * @param props.theme_name
 * @param props.class_name css name from template
 */
 export const loadTheme = async (props: {
  theme_name: string,
  class_name: string,
}) => {
  return await import('./theme/test.module.less');
}