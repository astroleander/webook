import { webook } from '../global';
import { LIFE_HOOKS } from './constant';
import { ModuleManagerSelector, getModuleTypeFromIdentifier } from './container/loader';
import { generateMetaRecordsFooter } from './footer';
import { BUTTON_KEYS, selectHeaderButton } from './header';
import { getMapKey, recursiveLoadTheme } from './utils';
import { effects } from './effects';
import { ModuleObject } from '../router/types';
import { createCodeBox } from './extensions/CodeBox';
type Module = any;
/**
 * Fragment: structure from template
 *   |-functions
 *   |-wrapper <- DocumentFragment
 *      |- header: structure from template
 *      |    |- buttons
 *      |- container: from loader
 *      |    |- module manager
 *      |- footer: from loader
 *           |- meta
 *           |- load cost
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
  defaultCallback = {
    onClose: () => {
      this.unmount();
      this.element?.remove();
    },
    onRefresh: () => {
      this.unmount();
      this.mount();
    },
    onCollapse: () => {
      if (!this.collapsed) {
        this.unmount();
      } else {
        this.mount();
      }
      this.collapsed = !this.collapsed;
    }
  }
  // callback hooks
  onContainerLoaded: Function = () => { };

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

  setContainer(moduleObject: ModuleObject) {
    const { moduleName, moduleLoader, defaultModule, nav, ...params } = moduleObject;
    try {
      const container = this.element?.querySelector('main');
      if (!container) {
        throw new Error('[Template Parsing Warning] Didn\'t find main element in your template');
      };
      const loadComponent = async () => {
        const recordTimestamp = effects.recordTimestamp();
        const esmodule = await moduleObject.moduleLoader();
        const key_of_first_child = Object.keys(esmodule)?.[0];

        const nav = moduleObject.nav ?? moduleObject.moduleName.split('/');
        const module = esmodule?.[defaultModule || key_of_first_child];
        const moduleType = getModuleTypeFromIdentifier(nav[0]);

        const Manager = await ModuleManagerSelector[moduleType](module, container);
        if (!Manager) {
          throw new Error(`[Template Parsing Warning] Get moduleManager failed, moduleType:', ${moduleType}`)
        }
        this.mount = Manager?.mount;
        this.unmount = Manager?.unmount;
        await this.mount?.();
        this.setMeta({
          'timestamp(ts)': recordTimestamp(),
          ...Manager.meta,
        })
      };
      loadComponent().then(() => this.onContainerLoaded(this));
    } catch (err) {
      console.warn('[FragmentFactory][setContainer]', err)
    } finally {
      return this;  
    }
  };

  setCallback(element_key: string, callback: Function) {
    if (!this.element) { return this };
    switch (element_key) {
      case BUTTON_KEYS.CLOSE:
      case BUTTON_KEYS.COLLAPSE:
      case BUTTON_KEYS.REFRESH:
        const button = selectHeaderButton(this.element, element_key);
        button && (button.onclick = (e) => {
          callback.call(this);
        });
        break;
      case LIFE_HOOKS.ON_LOADED:
        this.onContainerLoaded = callback;
        break;
    }
    return this;
  }

  setFooter(addon?: Record<string, string>) {
    const mergedMeta = Object.assign(addon || {}, this.meta);
    const footer = this.element?.querySelector('footer');
    footer?.append(...generateMetaRecordsFooter(mergedMeta));
    return this;
  }

  setMeta(meta?: Record<string, string>) {
    this.meta = Object.assign(this.meta, meta || {});
    return this;
  }

  setExtensions(moduleObject: ModuleObject) {
    const setupExtensions = async () => {
      if (moduleObject?.moduleRaw) {
        const code = await moduleObject.moduleRaw();
        this.element?.children[1].insertAdjacentElement('afterend', createCodeBox({ source: code }));
      }  
    }
    setupExtensions();
    return this;
  }
}

export const FragmentFactory = {
  createEffects: () => {
    return {
      recordTimestamp: effects.recordTimestamp()
    }
  },
  /**
   * Create Fragment with module file
   * @param props
   * @param identifier to identify module's type, name, category and path
   * @returns Fragment 
   */
  create: async (moduleObject: ModuleObject) => {
    const { recordTimestamp } = FragmentFactory.createEffects();
    const { moduleName, } = moduleObject;
    const params = {
      github_page_link: moduleObject?.github_page_link
    }
    const { theme, template } = webook.fragment;
    const name = moduleName;
    const wrapper = await FragmentTemplateLoader.loadWrapper(theme, template.wrapper);
    const header = await FragmentTemplateLoader.loadHeader(theme, template.header);
    if (!header || !wrapper) return document.createElement('div');

    const templateLoaded = recordTimestamp();

    const fragment = new Fragment(wrapper);

    fragment.setHeader(header, name)
      .setContainer(moduleObject)
      .setExtensions(moduleObject)
      .setCallback(LIFE_HOOKS.ON_LOADED, (f: Fragment) => {
        f.setFooter({
          // ...params,
          'timestamp(all)': recordTimestamp(),
          'timestamp(html)': templateLoaded,
        });
      })
      .setCallback(BUTTON_KEYS.REFRESH, fragment.defaultCallback.onRefresh)
      .setCallback(BUTTON_KEYS.CLOSE, fragment.defaultCallback.onClose)
      .setCallback(BUTTON_KEYS.COLLAPSE, fragment.defaultCallback.onCollapse)
    return fragment.element;
  },
}

type Loader = {
  component_token: 'header' | 'footer' | 'wrapper';
  template_token: string;
  theme_token: string;
}

const FragmentTemplateLoader = {
  cache: new Map<string, DocumentFragment>(),
  /**
   * Load Header DocumentFragment from './header/templates'
   * @returns {HTMLElement}
   */
  loadHeader: async (theme_token?: string, template_token?: string) => {
    const fragment = await FragmentTemplateLoader.loadTemplate({
      component_token: 'header',
      template_token: template_token ?? 'mac',
      theme_token: theme_token ?? 'basic',
    });
    await recursiveLoadTheme(fragment, theme_token);
    return fragment;
  },
  loadWrapper: async (theme_token?: string, template?: string) => {
    const fragment = await FragmentTemplateLoader.loadTemplate({
      component_token: 'wrapper',
      template_token: template ?? 'basic',
      theme_token: theme_token ?? 'basic',
    });

    await recursiveLoadTheme(fragment, theme_token);
    return fragment?.firstChild as Element;
  },
  setCacheIfNotExists: (props: Loader, fragment: DocumentFragment) => {
    const key = getMapKey(...Object.values(props));
    if (!FragmentTemplateLoader.cache.has(key)) {
      FragmentTemplateLoader.cache.set(key, fragment);
    }
  },
  getCache: (props: Loader) => {
    const key = getMapKey(...Object.values(props));
    return FragmentTemplateLoader.cache.get(key);
  },
  loadTemplate: async (props: Loader) => {
    try {
      const htmlRaw = await import(`./templates/${props.component_token}/${props.template_token}.html?raw`);
      const cache = FragmentTemplateLoader.getCache(props);
      if (cache) {
        return cache.cloneNode(true) as Element;
      } else {
        const node = document.createRange().createContextualFragment(htmlRaw.default);
        FragmentTemplateLoader.setCacheIfNotExists(props, node);
        return node.cloneNode(true) as Element;
      }
    } catch (err) {
      return null;
    }
    // const template = document.createRange().createContextualFragment()
  }
}  