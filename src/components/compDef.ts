import { ReactNode } from 'react';

// Schema Types

export type SchemaRuntime<S> = S & {id: string}

// Data Source Schema
export type DataSourceType = 'var' | 'props' | 'getter' | 'async'

export type DataSourceSchema = {
  name: string
  type: DataSourceType
  initValue?: any
  immediate?: boolean
  provider?: string
}

export interface DataSourceRuntime extends DataSourceSchema  {
  page: PageSchema
  id: string
}


export type DataSourceInstance = {
  schema: DataSourceSchema
  promise: Promise<any>
  pending?: boolean
  value?: any
}

// Binding Schema

export enum BindScopeEnum {
  Direct,
  Props,
  Page,
  Global
}

export enum BindTypeEnum {
  Model,
  Event
}

export type BindingSchema = {
  prop: string
  scope: BindScopeEnum
  type: BindTypeEnum
  binding: string
}


// Comp Prop Schema

export type PropType = 'string' | 'number' | 'boolean' | 'array' | 'record' | 'custom'

export type PropSchema = {
  name: string
  label?: string
  defaultValue?: any
  type?: PropType
  desc?: string
}

// Slot Schema

export type SlotType = 'single' | 'list' | 'loop'

export type SlotSchema = {
  name: string
  type: SlotType
  display?: 'block' | 'inline'
  binding?: BindingSchema
  children?: CompSchema[]
}

export interface SlotRuntime extends SlotSchema {
  comp: CompRuntime
  children?: CompRuntime[]
  id: string
}

// action schema

export interface ActionSchema {
  name: string
  label: string
  params?: PropSchema[]
}

export interface ActionRuntime extends ActionSchema {
  host: CompRuntime
  type: 'page' | 'comp' | 'datasource'
}

// Comp Schema

export type CompSchema = {
  provider: string
  name: string
  bindings?: BindingSchema[]
  slots?: SlotSchema[]
}

export interface CompRuntime extends CompSchema  {
  parent?: CompRuntime
  slots?: SlotRuntime[]
  id: string
}




// Page Schema

export type PageSchema = {
  name: string
  label?: string
  rootComp: CompSchema
  dataSources: DataSourceSchema[]
}

export interface PageRuntime extends PageSchema  {
  app: AppSchema
  rootComp: CompRuntime
  dataSources: DataSourceRuntime[]
}


// Other Schema
export type RouteType = {
  path: string
  page: string
}

export type AppSchema = {
  id?: number
  name: string
  label?: string
  routes: RouteType[]

}





// Def Part 
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------





// Comp Def

export type PropEditorType = {
  type: string
  config?: any
}


export type PropDef = {
  name: string
  label?: string
  editor?: PropEditorType | string // 需要预设的编辑器
  type?: any
  defaultValue?: any
  required?: boolean
}

// slot def

export type SlotDef = {
  name: string
  type: SlotType

}

// action def

export type ActionDef<P = {}, R = void> = {
  name: string
  label?: string
  params?: string
}



// event def 

export interface EventDef {
  name: string
  params?: any
}

export type RenderProps<T extends Record<string, any>> = {
  style?: string;
  classNames?: string;
  slots?: SlotRuntime[]
} & T;


// Comp Base

export type CompCreateContext = {
  emit: (event: string ,data?: any) => any
}

export type CompDefBase = {
  name: string
  label?: string
  create?: (context: CompCreateContext) => Record<string ,any>
  actions?: ActionDef[]
  events?: EventDef[]
  props?: PropDef[]
  createSchema?: (initSchema?: any) => any
}


// Data Source Def

export type DataSourceHook<D = any> = (params: any) => {
  data: D | undefined
  set: (data: D) => void
}

export interface AsyncDataSourceHook<D = any, P = {}> extends DataSourceHook<D> {
  run: (params: P) => Promise<D | undefined>
  loading: boolean
}

export interface DataSourceDef extends CompDefBase {
  type: DataSourceType
  params?: PropDef[]
  states?: PropDef[]
  create?: (context: CompCreateContext) => DataSourceHook | AsyncDataSourceHook
  createSchema: (schema: DataSourceSchema) => DataSourceSchema
}

export interface CompDef<P extends Record<string, any> = any> extends CompDefBase {
  desc?: string;
  version?: string;
  url?: string;
  render?: (props: RenderProps<P>) => JSX.Element
  createSchema?:(schema: CompSchema) => CompSchema
  slots?: SlotDef[]
  states?: PropDef[]
};



export interface PageDef extends CompDefBase {
  createSchema?: (initSchema?: PageSchema) => PageSchema
}



///////// Type def part finish
//---------------------------------------------------------------------------------------------------------------------------------------------------------------


export class CompManager {
  protected resolveMap: Record<string, Promise<CompDef>> = {};
  protected regTable: Record<string, CompDef> = {};

  protected scriptReadyHooks: ((key: string, script: string) => void)[] = [];
  protected beforeFetchScriptHooks: ((key: string) => string | void)[] = [];

  constructor() {
    const self = this;
    if (window.$comp?.cache) {
      window.$comp.cache.forEach((comp) => {
        self.regComp(comp);
      });
    }
    window.$comp = {
      reg(def: CompDef) {
        self.regComp(def);
      },
      cache: [],
    };
  }

  regComp(def: CompDef) {
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
    const promise = new Promise<CompDef>((resolve, reject) => {
      script.onload = () => {
        if (window.CompMod) {
          const comp = window.CompMod;
          this.regComp(comp);
          window.CompMod = undefined;
          resolve(comp);
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


declare var window: Window & {
  $comp?: {
    reg?(comp: CompDef): void;
    cache?: CompDef[];
  };
  CompMod?: CompDef;
};


function combineProps(
  oldProps: Record<string, any>,
  newProps: Record<string, any>,
) {
  Object.keys(newProps).forEach((key) => {
    oldProps[key] = newProps[key];
  });
  return oldProps;
}



export function ExportComp(def: CompDef) {
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
