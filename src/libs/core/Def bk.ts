import { CompAgent } from './CompAgent';

//#regin base


export type SchemaBase = {
  name: string
  label?: string
  desc?: string
}

export interface EventDef extends SchemaBase {
  payload?: any
}

export interface ActionDef extends SchemaBase {
  params?: any
}

// 这个是内置的属性编辑器。
export type PropEditorType = {
  type: string
  config?: any
}

export type PropType = 'string' | 'number' | 'boolean' | 'record' | 'array'

export interface PropDef extends SchemaBase  {
  editor?: PropEditorType | string // 需要预设的编辑器
  type?: PropType
  defaultValue?: any
  required?: boolean
}


export interface CompSchemaBase extends SchemaBase {
  id: string // comp schema 也需要ID，为的是在 schema 中定位。区别于 comp instance 的 id
  provider: string
  defaultProps?: Record<string, any>
}

// 创建实例时的上下文。目前虽然好像没啥用，改用 comp agent 了。
// export type CompContext = {
//   emit: (event: string ,data?: any) => any
//   onAction: (action: string, params: any) => any
//   offAction: (action: string) => void
//   setState: (state: any) => void
//   onPropChange: (propName: string, value: any) => void
//   readonly state: any
//   mode?: 'design' | 'run' | 'view'
// }


export type CompDefBase<S extends CompSchemaBase = CompSchemaBase> = {
  name: string
  label?: string
  desc?: string
  events?: EventDef[]
  props?: PropDef[]
  actions?: ActionDef[]
  states?: PropDef[]
  // 运行时创建实例
  create?: (agent: CompAgent) => any
  // 设计时初始 schema
  createSchema?: (initSchema: S) => S
}

export interface CompInstanceBase<S extends CompSchemaBase = CompSchemaBase> {
  def: CompDefBase<S>
  schema: S
  id: string
  type: string
  states: Record<string, any>

}

export type CompPropType = 'string' | 'number' | 'boolean' | 'array' | 'record' | 'custom'

export interface CompPropSchema extends SchemaBase {
  defaultValue?: any
  type?: CompPropType
}

export type PropValueSchema = {
  prop: string
  value: any

}

//#endregion base



export namespace DataSource {

  
  export type DataSourceType = 'var' | 'props' | 'getter' | 'async'
  
  export interface Schema extends CompSchemaBase {
    type: DataSourceType
    initValue?: any
    immediate?: boolean
  }
  
  export type Hook<D = any, P = any> = (params: any) => {
    data: D | undefined
    setData: (data: D) => void
    fetch: (params: P) => D
    loading: boolean
  }
  
  export interface AsyncHook<D = any, P = {}> extends Hook<D> {
    run: (params: P) => Promise<D | undefined>
    loading: boolean
  }

  export interface Def extends CompDefBase<Schema> {
    type: DataSourceType
    params?: PropDef[]
    createSchema?: (schema: Schema) => Schema
  }
  
  // export interface Instance extends CompInstanceBase<Schema> {
  //   def: Def
  //   scope: BindingScope.Instance
  //   promise: Promise<any>
  //   pending?: boolean
  //   value?: any
  // }
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
    children?: Schema[]
  }
  
  // export interface SlotInstance {
  //   comp: Instance
  //   children?: Instance[]
  // }
  
  
  export interface Schema extends CompSchemaBase {
    slots?: SlotSchema[]
  }
  
  
  // export interface Instance extends CompInstanceBase<Schema> {
  //   parent?: Instance
  //   slot?: string
  // }
  
  export type RenderProps<T extends Record<string, any> = Record<string, any>> = {
    style?: string;
    classNames?: string;
    // instance: Instance
    props?: T // 组件定义的 props
    agent: CompAgent
    slots?: SlotSchema[] // TODO: 存疑，slot 应该有 instance?
  }
  
  
  export interface Def<P extends Record<string, any> = any> extends CompDefBase {
    version?: string;
    url?: string;
    render?: (props: RenderProps<P>) => JSX.Element
    createSchema?:(schema: Schema) => Schema
    slots?: SlotDef[]
  };
}





// Binding Scope

export namespace BindingScope {

  // Binding Schema
  // Bindings are page level logic

  export type BindingSchema = {
    source: {
      id: string
      prop: string
    }
    target: {
      id: string
      prop: string
    }
    type: 'event' | 'state'
  }

  export interface BindingInstance {
    id: string
    schema: BindingSchema
    handler: (payload?: any) => void
  }
  export interface Schema extends CompSchemaBase {
    name: string
    label?: string
    uiRoot: UIComp.Schema
    dataSources: DataSource.Schema[]
    bindings: BindingSchema[]
  }
  // export interface Instance extends CompInstanceBase<Schema>  {
  //   rootComp: UIComp.Instance
  //   dataSources: DataSource.Instance[]
  // }

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

export interface AppInstance extends CompInstanceBase<AppSchema>  {
}




// Def Part 
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------





// Comp Def



// slot def



function combineProps(
  oldProps: Record<string, any>,
  newProps: Record<string, any>,
) {
  Object.keys(newProps).forEach((key) => {
    oldProps[key] = newProps[key];
  });
  return oldProps;
}

