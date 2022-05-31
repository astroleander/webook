import { ModuleManagerSelector, getModuleTypeFromIdentifier } from './container/loader';
import { generateMetaRecordsFooter } from './footer';
import { BUTTON_KEYS, selectHeaderButton } from './header';

type Module = any;
/**
 * Fragment: structure from template
 *   |-functions
 *   |-element, the wrapper
 *      |- header: structure from template
 *      |    |- buttons
 *      |- container: from loader
 *      |    |- module manager
 */
class Fragment {
  element?: Element;
  meta: Record<string, string> = {};
  // container events
  mount: () => void = () => { };
  unmount: () => void = () => { };
  // callback events
  onClose = () => {
    this.unmount();
    this.element?.remove();
  };
  onRefresh = () => {
    this.unmount();
    this.mount();
  };

  constructor(node: Element) {
    this.element = node;
  }

  setHeader(header: Element, title_text?: string) {
    const element = this.element?.querySelector('header');

    if (element) {
      element.appendChild(header);
      const title = element.querySelector('.title');
      title_text && title && (title.innerHTML = title_text);
    } else {
      console.warn('[Template Parsing Warning] Didn\'t find header element in your template');
    }
    return this;
  }

  setContainerWithFooter(module: Module, identifier: string) {
    const container = this.element?.querySelector('main');

    const loadComponent = async () => {
      console.log('[load component]', identifier);
      if (container) {
        const moduleType = getModuleTypeFromIdentifier(identifier);
        const moduleManager = await ModuleManagerSelector[moduleType](module, container);
        this.mount = moduleManager.mount;
        this.unmount = moduleManager.unmount;
        this.mount();

        this.setFooter(moduleManager.meta);
      } else {
        console.warn('[Template Parsing Warning] Didn\'t find main element in your template');
        return;
      };
    };
    loadComponent();
    return this;
  }

  setCallback(cb_type: keyof Fragment, element_key: BUTTON_KEYS) {
    if (this.element) {
      const element = selectHeaderButton(this.element, element_key);
      element.onclick = (e) => {
        (this[cb_type] as Function)?.();
      };
    } else {
      console.warn('[Template Parsing Warning] Didn\'t find header element in your template, can\'t set callback');
    }
    return this;
  }

  setFooter(addon?: Record<string, string>) {
    const mergedMeta = Object.assign(addon, this.meta);
    const footer = this.element?.querySelector('footer');
    footer?.append(...generateMetaRecordsFooter(mergedMeta));
  }

  setMeta(meta?: Record<string, string>) {
    this.meta = meta ?? {};
    return this;
  }
}
export const FragmentFactory = {
  /**
   * Create Fragment with module file
   * @param props 
   * @returns Fragment 
   */
  create: async (props: {
    module: any,
    identifier: string,
    wrapper_type?: string,
    params?: {
      github_page_link?: string
    }
  }) => {
    const { module, identifier, wrapper_type, params } = props;
    // const { github_page_link } = params ?? {};

    // [type, ...categories, name] = identifier
    const [type, ...categories] = identifier.split('.');
    const name = categories.pop();

    const html_wrapper = await FragmentFactory.getFragmentWrapper(wrapper_type);
    const html_header = await FragmentFactory.getFragmentHeader(wrapper_type);

    const fragment = new Fragment(html_wrapper);
    fragment.setHeader(html_header, name)
      .setMeta(params)
      .setContainerWithFooter(module, identifier)
      .setCallback('onRefresh', BUTTON_KEYS.REFRESH)
      .setCallback('onClose', BUTTON_KEYS.CLOSE)
    return fragment.element;
  },
  /**
   * Load Wrapper DocumentFragment from './wrappers/templates'
   * @returns {HTMLElement}
   */
  getFragmentWrapper: async (wrapper_type?: string) => {
    switch (wrapper_type) {
      default:
        return await import('./wrapper/templates/basic.html?raw').then((templateRawString) => {
          const node = document.createRange().createContextualFragment(templateRawString.default);
          // wrapper only has one root element
          return node.cloneNode(true).firstChild as Element;
        });
    }
  },
  /**
   * Load Header DocumentFragment from './header/templates'
   * @returns {HTMLElement}
   */
  getFragmentHeader: async (wrapper_type?: string) => {
    switch (wrapper_type) {
      default:
        return await import(`./header/templates/mac.html?raw`).then((headerRawString) => {
          const node = document.createRange().createContextualFragment(headerRawString.default);
          return node.cloneNode(true) as Element;
        })
    }
  },
}