import { StyleClassList } from './constant';
import { ModuleManagerSelector, getModuleTypeFromIdentifier } from './container/loader';
import { generateMetaRecordsFooter } from './footer';
import { BUTTON_KEYS, selectHeaderButton } from './header';
import { mapKey } from './utils';

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
  // status
  collapsed: boolean = false;
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
  onCollapse = () => {
    if (!this.collapsed) {
      this.unmount();
    } else {
      this.mount();
    }
    
    this.collapsed = !this.collapsed;
    // if (!this.collapsed) {
    //   Array.from(this.element?.children || []).forEach((e) => {
    //     if ((e as HTMLElement).style && e.tagName !== 'HEADER') {
    //       (e as HTMLElement).style.display = 'gone';
    //     }
    //   })
    // } else {
    //   Array.from(this.element?.children || []).forEach((e) => {
    //     if ((e as HTMLElement).style && e.tagName !== 'HEADER') {
    //       (e as HTMLElement).style.visibility = 'collapse';
    //     }
    //   })
    // }
  }

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
        let [start_timestamp, end_timestamp] = [window?.performance.now(), 0];
        const moduleType = getModuleTypeFromIdentifier(identifier);
        const moduleManager = await ModuleManagerSelector[moduleType](module, container);
        end_timestamp = window?.performance.now();
        this.mount = moduleManager.mount;
        this.unmount = moduleManager.unmount;
        this.mount();

        this.setFooter({
          ...moduleManager.meta,
          'load cost': (end_timestamp - start_timestamp).toFixed(2) + 'ms',
        });
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
      element && (element.onclick = (e) => {
        (this[cb_type] as Function)?.();
      });
    } else {
      console.warn('[Template Parsing Warning] Didn\'t find header element in your template, can\'t set callback');
    }
    return this;
  }

  setFooter(addon?: Record<string, string>) {
    const mergedMeta = Object.assign(addon || {}, this.meta);
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
    params?: Record<string, any>
  }) => {
    const { module, identifier, wrapper_type, params } = props;
    // const { github_page_link } = params ?? {};
    // [type, ...categories, name] = identifier
    const [module_type, ...categories] = identifier.split('.');
    const name = categories.pop();
    const styled_template_id = FragmentFactory.getFragmentTemplateId(wrapper_type, module_type, name, categories);
    const html_wrapper = await FragmentFactory.getFragmentWrapper(styled_template_id);
    const html_header = await FragmentFactory.getFragmentHeader(styled_template_id);

    const fragment = new Fragment(html_wrapper);
    fragment.setHeader(html_header, name)
      .setMeta(params)
      .setContainerWithFooter(module, identifier)
      .setCallback('onRefresh', BUTTON_KEYS.REFRESH)
      .setCallback('onClose', BUTTON_KEYS.CLOSE)
      .setCallback('onCollapse', BUTTON_KEYS.COLLAPSE)
    return fragment.element;
  },
  /**
   * Load Wrapper DocumentFragment from './wrappers/templates'
   * @returns {HTMLElement}
   */
  getFragmentWrapper: async (styled_template_id?: StyleClassList) => {
    let templateFile = `basic`;
    switch (styled_template_id) {
      case StyleClassList.BASIC_ERROR:
        templateFile = `basic.error`
        break;
    }
    return await import(`./wrapper/templates/${templateFile}.html?raw`).then((templateRawString) => {
      const node = document.createRange().createContextualFragment(templateRawString.default);
      // wrapper only has one root element
      return node.cloneNode(true).firstChild as Element;
    });
  },
  /**
   * Load Header DocumentFragment from './header/templates'
   * @returns {HTMLElement}
   */
  getFragmentHeader: async (styled_template_id?: StyleClassList) => {
    let templateFile = `mac`;
    switch (styled_template_id) {
    }
    return await import(`./header/templates/${templateFile}.html?raw`).then((templateRawString) => {
      const node = document.createRange().createContextualFragment(templateRawString.default);
      return node.cloneNode(true) as Element;
    });
  },
  /**
   * @param wrapper_type the wrapper type defined by users manually
   * @param module_type the route prefix, told the framework/tech types
   * @param categories
   */
  getFragmentTemplateId: (wrapper_type: string | null | undefined, module_type: string, name: string | undefined, categories: string[]) => {
    // TODO: wrapper_type priority
    // const specific_categories_tags = categories.xx
    if (module_type === 'webook') {
      switch (categories?.[0]) {
        case 'error':
          return FragmentFactory.fragmentTemplateRules.get(mapKey(null, 'webook', 'error', null));
      }
    }
    // console.log(mapKey(wrapper_type, module_type, name, null));
    return FragmentFactory.fragmentTemplateRules.get(mapKey(wrapper_type, module_type, name, null));
  },
  fragmentTemplateRules: new Map([
    [mapKey(null, 'webook', 'error', null), StyleClassList.BASIC_ERROR],
  ])
}

