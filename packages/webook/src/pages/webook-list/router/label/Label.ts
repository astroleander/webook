// vite only
import styles from './label.module.less';
import { svelte } from '@sveltejs/vite-plugin-svelte';

type LabelType = string;

const LabelTypeStringMapping: {
  [x: string]: string;
} = {
  rn: 'RN',
  react: 'React',
  svelte: 'svelte'
}

class Label {
  element: Element;
  constructor(labelType: LabelType) {
    this.element = document.createElement('span');
    if (labelType === 'leetcode') {
      this.element.appendChild(Label.createLeetCodeLabel());
    } else {
      this.element.innerHTML = LabelTypeStringMapping[labelType] ?? labelType;
    }
    this.element.className = styles[labelType] ?? styles['default'];
  }
  static createLeetCodeLabel () {
    const link = 'https://assets.leetcode.com/static_assets/public/webpack_bundles/images/logo-dark.e99485d9b.svg';
    const img = document.createElement('img');
    img.setAttribute('src', link);
    img.style.height = '0.6em';
    return img;
  }
}

export const LabelFactory = {
  create: (type: string) => {
    const label = new Label(type as LabelType);
    return label.element;
  },
}
