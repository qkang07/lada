import { CompAgent } from './CompAgent';

export type SchemaBase = {
  name: string
  label?: string
  desc?: string
}

export interface EventActionDef extends SchemaBase {
  valueType?: ValueType

}

// 这个是内置的属性编辑器。
export type PropEditorType = {
  type: 'string' | 'select' | 'radio' | 'boolean' | 'number' | 'textarea',
  config?: any
}

export type ValueType = 'string' | 'number' | 'boolean' | 'record' | 'array' | 'any'

export interface StatePropDef extends SchemaBase  {
  editor?: PropEditorType // 需要预设的编辑器
  editorRender?: () => JSX.Element
  valueType?: ValueType
  defaultValue?: any
  required?: boolean
}


export interface CompSchemaBase extends SchemaBase {
  id: string // comp schema 也需要ID，为的是在 schema 中定位。区别于 comp instance 的 id
  provider: string
  defaultProps?: Record<string, any>
}


export type CompDefBase<S extends CompSchemaBase = CompSchemaBase, I = any> = {
  name: string
  label?: string
  desc?: string
  events?: EventActionDef[]
  props?: StatePropDef[]
  actions?: EventActionDef[]
  states?: StatePropDef[]
  // 运行时创建实例
  create?: (agent: CompAgent) => I
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

// export namespace DataSource {

//   export type DataSourceType = 'var' | 'props' | 'getter' | 'async'
  
//   export interface Schema extends CompSchemaBase {
//     type: DataSourceType
//     initValue?: any
//     // immediate?: boolean
//   }
  
//   export interface Def extends CompDefBase<Schema> {
//     type: DataSourceType
//     params?: StatePropDef[]
//   }
// }

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
  
  export type RenderProps<T extends Record<string, any> = Record<string, any>, I = any> = {
    style?: string;
    classNames?: string;
    // agent: CompAgent
    instance?: I
    updateState? :(name: string, value?: any) => void
    slots?: SlotSchema[] // TODO: 存疑，slot 应该有 instance?
  } & T
  
  
  export interface Def<P extends Record<string, any> = any, I = any> extends CompDefBase<Schema> {
    version?: string;
    url?: string;
    render?: (props: RenderProps<P, I>) => JSX.Element | null
    slots?: SlotDef[]
  };
}

export type BindingInfo = {
  id: string
  prop: string
}

export type BindingElement = 'event' | 'action' | 'state' | 'prop'

export type BindingType = 'event-action' | 'state-prop'

export type BindingSchema = {
  source: BindingInfo
  target: BindingInfo
  type: BindingType
}

export interface BindingInstance {
  // id: string
  schema: BindingSchema
  handler: (payload?: any) => void
}
export interface BindingScopeSchema extends CompSchemaBase {
  uiRoot: UIComp.Schema
  dataSources: UIComp.Schema[]
  normalComps: CompSchemaBase[]
  bindings: BindingSchema[]
  
}

export interface DesignSchema extends BindingScopeSchema {
  
}