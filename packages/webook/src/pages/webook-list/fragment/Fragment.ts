import { webook } from '../global';
import { RouterItem } from '../router/types';
import { LIFE_HOOKS } from './constant';
import { ModuleManagerSelector, getModuleTypeFromIdentifier } from './container/loader';
import { generateMetaRecordsFooter } from './footer';
import { BUTTON_KEYS, selectHeaderButton } from './header';
import { recursiveLoadTheme } from './themes/themeLoader';
import { effects, getMapkey } from './utils';

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
  onContainerLoaded: Function = () => {};

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

  setContainer(module: Module, identifier: string) {
    const container = this.element?.querySelector('main');
    const loadComponent = async () => {
      console.log('[load component]', identifier);
      if (container) {
        const recordTimestamp = effects.recordTimestamp();
        const moduleType = getModuleTypeFromIdentifier(identifier);
        const moduleManager = await ModuleManagerSelector[moduleType](module, container);
        this.mount = moduleManager.mount;
        this.unmount = moduleManager.unmount;
        await this.mount();
        this.setMeta({
          'timestamp(ts)': recordTimestamp(),
          ...moduleManager.meta,
        });
      } else {
        console.warn('[Template Parsing Warning] Didn\'t find main element in your template');
        return;
      };
    };
    loadComponent().then(() => this.onContainerLoaded(this));
    return this;
  }

  setCallback(element_key: string, callback: Function) {
    if (!this.element) { return this};
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
  create: async (props: RouterItem) => {
    const { recordTimestamp } = FragmentFactory.createEffects();

    const { module, moduleName, params } = props;
    const { theme, template } = webook.fragment;

    const name = moduleName.split('.').pop();
    const wrapper = await FragmentTemplateLoader.loadWrapper(theme, template.wrapper);
    const header = await FragmentTemplateLoader.loadHeader(theme, template.header);
    if (!header || !wrapper) return document.createElement('div');

    const templateLoaded = recordTimestamp();

    const fragment = new Fragment(wrapper);

    fragment.setHeader(header, name)
      .setContainer(module, moduleName)
      .setCallback(LIFE_HOOKS.ON_LOADED, (f: Fragment) => {
        f.setFooter({
          ...params,
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
    const fragment =  await FragmentTemplateLoader.loadTemplate({
      component_token: 'wrapper',
      template_token: template ?? 'basic',
      theme_token: theme_token ?? 'basic',
    });
    await recursiveLoadTheme(fragment, theme_token);
    return fragment?.firstChild as Element;
  },  
  setCacheIfNotExists: (props: Loader, fragment: DocumentFragment) => {
    const key = getMapkey(...Object.values(props));
    if (!FragmentTemplateLoader.cache.has(key)) {
      FragmentTemplateLoader.cache.set(key, fragment);
    }
  },
  getCache: (props: Loader) => {
    const key = getMapkey(...Object.values(props));
    return FragmentTemplateLoader.cache.get(key);
  },
  loadTemplate: async (props: Loader) => {
    try {
      const htmlRaw = await import(`./templates/${props.component_token}/${props.template_token}.html?raw`);
      const node = document.createRange().createContextualFragment(htmlRaw.default);
      const element = (FragmentTemplateLoader.getCache(props) ?? node).cloneNode(true);
      FragmentTemplateLoader.setCacheIfNotExists(props, node);
      return element as Element;
    } catch (err) {
      return null;
    }
    // const template = document.createRange().createContextualFragment()
  }
}  