// vite only
import styles from './label.module.less';
import { svelte } from '@sveltejs/vite-plugin-svelte';

type LabelType = 
  'rn' | 'react' | 'vue' | 'svelte';

const LabelTypeStringMapping: {
  [x: string]: string;
} = {
  rn: 'RN',
  react: 'React',
  svelte: 'svelte'
}

class Label  {
  element: Element;
  constructor(labelType: LabelType) {
    this.element = document.createElement('span');
    this.element.className = styles[labelType] ?? styles['default'];
    this.element.innerHTML = LabelTypeStringMapping[labelType] ?? labelType;
  }
}

export const LabelFactory = {
  create: (type: string) => {
    const label = new Label(type as LabelType);
    return label.element;
  },
}
