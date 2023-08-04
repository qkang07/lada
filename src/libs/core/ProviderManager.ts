import { CompDefBase, UIComp } from "./Def";

declare var window: Window & {
  $comp?: {
    reg?(comp: CompDefBase): void;
    cache?: CompDefBase[];
  };
  // 加载时的临时挂载变量
  CompMod?: CompDefBase;
};




export function ExportComp(def: UIComp.Def) {
  if (window.$comp?.reg) {
    window.$comp.reg(def);
  } else {
    if (!window.$comp) {
      window.$comp = { cache: [] };
    } else if (!window.$comp.cache) {
      window.$comp.cache = [];
    }
    window.$comp.cache?.push(def);
  }
}

/// utils
/**
 * gen string hash
 * from stackoverflow
 */
const cyrb53 = (str: string, seed = 0) => {
  let h1 = 0xdeadbeef ^ seed,
    h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }

  h1 =
    Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
    Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 =
    Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
    Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

export class ProviderManager<D extends CompDefBase> {
  protected resolveMap: Record<string, Promise<D>> = {};
  protected regTable: Record<string, D> = {};

  protected scriptReadyHooks: ((key: string, script: string) => void)[] = [];
  protected beforeFetchScriptHooks: ((key: string) => string | void)[] = [];

  constructor() {
    const self = this;
    if (window.$comp?.cache) {
      window.$comp.cache.forEach((comp) => {
        self.regComp(comp as D);
      });
    }
    window.$comp = {
      reg(def: D) {
        self.regComp(def);
      },
      cache: [],
    };
  }

  regComp(def: D) {
    const name = def.name;
    this.regTable[name] = def;
  }

  getComp(name: string) {
    const comp = this.regTable[name];
    if (comp) {
      return comp;
    } else {
      console.error('no comp found: ', name);
      return void 0;
    }
  }

  names() {
    return Object.keys(this.regTable);
  }

  protected handleScriptLoad(script: HTMLScriptElement) {
    const promise = new Promise<D>((resolve, reject) => {
      script.onload = () => {
        if (window.CompMod) {
          const comp = window.CompMod;
          this.regComp(comp as D);
          window.CompMod = undefined;
          resolve(comp as D);
        } else {
          reject('No CompMod Found');
        }
        script.remove();
      };
      script.onerror = (e) => {
        reject(e);
      };
      document.head.appendChild(script);
    });

    return promise;
  }

  resolveFromUrl(url: string) {
    if (!this.resolveMap[url]) {
      const script = document.createElement('script');
      script.src = url;
      this.resolveMap[url] = this.handleScriptLoad(script);
    }
    return this.resolveMap[url];
  }
  resolveFromScript(jsScript: string) {
    const hash = cyrb53(jsScript);

    if (!this.resolveMap[hash]) {
      const script = document.createElement('script');
      script.textContent = jsScript;
      this.resolveMap[hash] = this.handleScriptLoad(script);
    }
    return this.resolveMap[hash];
  }
}