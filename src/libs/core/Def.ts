import { CompAgent } from './CompAgent';

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

export type PropType = 'string' | 'number' | 'boolean' | 'record' | 'array' | 'any'

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

export type CompPropType = 'string' | 'number' | 'boolean' | 'array' | 'record' | 'custom'

export interface CompPropSchema extends SchemaBase {
  defaultValue?: any
  type?: CompPropType
}

export type PropValueSchema = {
  prop: string
  value: any

}

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
  }
}

export interface ActionSchema extends SchemaBase {
  params?: SchemaBase[]
}


export namespace UIComp {

  export type SlotType = 'single' | 'list' | 'loop'
  
  export interface SlotDef extends SchemaBase {
    type: SlotType
    display?: 'block' | 'inline'
  }
  export interface SlotSchema extends SchemaBase {
    // type: SlotType
    // display?: 'block' | 'inline'
    children?: Schema[]
  }
  
  export interface Schema extends CompSchemaBase {
    slots?: SlotSchema[]
  }
  
  export type RenderProps<T extends Record<string, any> = Record<string, any>> = {
    style?: string;
    classNames?: string;
    // agent: CompAgent
    updateState? :(name: string, value?: any) => void
    slots?: SlotSchema[] // TODO: 存疑，slot 应该有 instance?
  } & T
  
  
  export interface Def<P extends Record<string, any> = any> extends CompDefBase<Schema> {
    version?: string;
    url?: string;
    render?: (props: RenderProps<P>) => JSX.Element
    slots?: SlotDef[]
  };
}

export type BindingInfo = {
  id: string
  prop: string
}

export type BindingSchema = {
  source: BindingInfo
  target: BindingInfo
  type: 'event' | 'state'
}

export interface BindingInstance {
  // id: string
  schema: BindingSchema
  handler: (payload?: any) => void
}
export interface BindingScopeSchema extends CompSchemaBase {
  uiRoot: UIComp.Schema
  dataSources: DataSource.Schema[]
  bindings: BindingSchema[]
}