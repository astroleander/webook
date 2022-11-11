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
 * CSS files and styles can't be nested (due to css-loader module feature)
 * @param root documentfragment template root element
 * @param theme theme_token
 */
export const recursiveLoadTheme = async (root: Element | null, theme?: string) => {
  if (!root) { return };
  try {
    const classesModule = await import(`../themes/${theme}.module.css`);
    const classes = {
      ...classesModule,
      ...classesModule.default
    }
    _recursiveLoadTheme(root, classes);
  } catch (err) {
    console.error(err);
  }
}

const _recursiveLoadTheme = (root: Element, classes: any) => {
  const element = root;
  if (element.classList) {
    for (const className of element.classList) {
      classes[className] && element.classList.add(classes[className]);
    }
  };
  Array.from(element.children).forEach((element) => _recursiveLoadTheme(element, classes));
}