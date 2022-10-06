import { collectTemplate, collectTheme } from '../fragment/utils';
import { webook } from '../global';

export const initMenu = (props: {
  __debug: boolean;
  menuElement: Element | null;
}) => {
  if (!props.menuElement) { return; }
  // props.menuElement.append('menu');
  collectTemplate().then((templates) => {
    for (const part in templates) {
      const selector = createSelector(
        templates[part],
        `template.${part}`,
        (v) => {
          // @ts-ignore assert that
          webook.fragment.template[part] = v
          // @ts-ignore assert that
        }, webook.fragment.template[part]);
      props.menuElement?.appendChild(selector);
    }
  });
  collectTheme().then((themes) => {
    const selector = createSelector(themes, 'theme', (v) => {
      webook.fragment.theme = v;
    }, webook.fragment.theme);
    props.menuElement?.appendChild(selector);
  });
};

const createSelector = (options: Array<any>, name: string, onchange: (v: string) => void, selected: string) => {
  const wrapper = document.createElement('div');
  wrapper.className = `selector-${name}`;

  const labelElement = document.createElement('label');
  labelElement.setAttribute('for', name);
  labelElement.innerHTML = `${name}\t`;

  const selectElement = document.createElement('select');
  for (const option of options) {
    const optionElement = document.createElement('option');
    optionElement.innerHTML = option;
    optionElement.value = option;
    selectElement.appendChild(optionElement);
    selectElement.onchange = (e) => {
      const s = e.target as HTMLSelectElement;
      const v = s.options[s.selectedIndex].value;
      onchange(v);
    }
  }
  selectElement.selectedIndex = options.findIndex(o => o === selected);
  wrapper.appendChild(labelElement);
  wrapper.appendChild(selectElement);
  return wrapper;
}