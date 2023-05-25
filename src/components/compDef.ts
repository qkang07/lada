import { ReactNode } from 'react';

//#regin base


export type SchemaBase = {
  name: string
  label?: string
  desc?: string
}


export interface CompSchemaBase extends SchemaBase {
  provider: string
}

// 创建实例时的上下文。目前虽然好像没啥用
export type CompCreateContext = {
  // emit: (event: string ,data?: any) => any
}


export type CompDefBase<S extends CompSchemaBase = CompSchemaBase> = {
  name: string
  label?: string
  desc?: string
  create?: (context: CompCreateContext) => Record<string ,any>
  ins?: ActionDef[]
  events?: EventDef[]
  props?: PropDef[]
  createSchema?: (initSchema?: S) => S
}

export type CompInstanceBase<S extends CompSchemaBase = CompSchemaBase> = {
  def: CompDefBase<S>
  schema: S
  id: string
}

export type CompPropType = 'string' | 'number' | 'boolean' | 'array' | 'record' | 'custom'

export interface CompPropSchema extends SchemaBase {
  defaultValue?: any
  type?: CompPropType
}

//#endregion base



export namespace DataSource {

  
  export type DataSourceType = 'var' | 'props' | 'getter' | 'async'
  
  export interface Schema extends CompSchemaBase {
    type: DataSourceType
    initValue?: any
    immediate?: boolean
  }
  
  export type Hook<D = any> = (params: any) => {
    data: D | undefined
    set: (data: D) => void
  }
  
  export interface AsyncHook<D = any, P = {}> extends Hook<D> {
    run: (params: P) => Promise<D | undefined>
    loading: boolean
  }
  
  export interface Def extends CompDefBase<Schema> {
    type: DataSourceType
    params?: PropDef[]
    states?: PropDef[]
    create?: (context: CompCreateContext) => Hook | AsyncHook
    createSchema: (schema?: Schema) => Schema
  }
  
  export interface Instance extends CompInstanceBase<Schema> {
    def: Def
    schema: Schema
    page: PageInstance
    promise: Promise<any>
    pending?: boolean
    value?: any
  }
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



//#region action

export interface ActionSchema extends SchemaBase {
  params?: SchemaBase[]
}

export interface ActionInstance extends ActionSchema {
  host: CompInstanceBase
  type: 'page' | 'comp' | 'datasource'
}

//#endregion



export namespace UIComp {

  export type SlotType = 'single' | 'list' | 'loop'
  
  export type SlotDef = {
    name: string
    type: SlotType
  }
  export interface SlotSchema extends SchemaBase {
    type: SlotType
    display?: 'block' | 'inline'
    binding?: BindingSchema
    children?: Schema[]
  }
  
  export interface SlotInstance {
    comp: Instance
    children?: Instance[]
  }
  
  
  export interface Schema extends CompSchemaBase {
    bindings?: BindingSchema[]
    slots?: SlotSchema[]
  }
  
  
  export interface Instance extends CompInstanceBase {
    parent?: Instance
    slot: string
  }
  
  export type RenderProps<T extends Record<string, any>> = {
    style?: string;
    classNames?: string;
    slots?: SlotSchema[] // TODO: 存疑，slot 应该有 instance?
  } & T;
  
  
  export interface Def<P extends Record<string, any> = any> extends CompDefBase {
    version?: string;
    url?: string;
    render?: (props: RenderProps<P>) => JSX.Element
    createSchema?:(schema?: Schema) => Schema
    slots?: SlotDef[]
    states?: PropDef[]
  };
}



// Page Schema

export interface PageSchema extends CompSchemaBase {
  name: string
  label?: string
  rootComp: UIComp.Schema
  dataSources: DataSource.Schema[]
}

export interface PageInstance extends CompInstanceBase  {
  app: AppInstance
  rootComp: UIComp.Instance
  dataSources: DataSource.Instance[]
}


// Other Schema
export type RouteType = {
  path: string
  page: string
}

export interface AppSchema extends CompSchemaBase {
  routes: RouteType[]
}

export interface AppDef extends CompDefBase {

}

export interface AppInstance extends CompInstanceBase  {
  schema: AppSchema
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



// Comp Base






// Data Source Def






export interface PageDef extends CompDefBase<PageSchema> {
  createSchema?: (initSchema?: PageSchema) => PageSchema
}



///////// Type def part finish
//---------------------------------------------------------------------------------------------------------------------------------------------------------------
declare var window: Window & {
  $comp?: {
    reg?(comp: CompDefBase): void;
    cache?: CompDefBase[];
  };
  // 加载时的临时挂载变量
  CompMod?: CompDefBase;
};


export class DefManager<D extends CompDefBase> {
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




function combineProps(
  oldProps: Record<string, any>,
  newProps: Record<string, any>,
) {
  Object.keys(newProps).forEach((key) => {
    oldProps[key] = newProps[key];
  });
  return oldProps;
}



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
