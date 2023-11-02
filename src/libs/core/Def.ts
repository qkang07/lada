import { CSSProperties } from 'react';
import type { CompAgent } from './CompAgent';

export type DescBase = {
  name: string
  label?: string
  desc?: string
}

export interface EventActionDef extends DescBase {
  valueType?: ValueType

}

// 这个是内置的属性编辑器。
export type PropEditorType = {
  type: 'string' | 'select' | 'radio' | 'boolean' | 'number' | 'textarea' | 'options',
  config?: any
}

export type ValueType = 'string' | 'number' | 'boolean' | 'record' | 'array' | 'any'

export interface StatePropDef extends DescBase  {
  editor?: PropEditorType // 需要预设的编辑器
  editorRender?: string | (() => JSX.Element)
  valueType?: ValueType
  defaultValue?: any
  required?: boolean
}


export interface CompSchemaBase extends DescBase {
  id: string // comp schema 也需要ID，为的是在 schema 中定位。区别于 comp instance 的 id
  provider: string
  defaultProps?: Record<string, any>
}

export interface CompMetaBase extends DescBase {
  version?: string
  icon?: string | JSX.Element
  events?: EventActionDef[]
  props?: StatePropDef[]
  actions?: EventActionDef[]
  states?: StatePropDef[]
}


export interface CompDefBase<S extends CompSchemaBase = CompSchemaBase, I = any> extends CompMetaBase  {
  // 运行时创建实例
  onCreate?: (agent: CompAgent) => I
  // 设计时初始 schema
  onSchemaCreate?: (initSchema: S) => S
}

export type CompPropType = 'string' | 'number' | 'boolean' | 'array' | 'record' | 'custom'

export interface CompPropSchema extends DescBase {
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

export interface ActionSchema extends DescBase {
  params?: DescBase[]
}


export namespace UIComp {

  export type SlotType = 'single' | 'list' | 'loop'
  
  export interface SlotDef extends DescBase {
    single?: boolean
    prop?: StatePropDef
  }
  export interface SlotSchema extends DescBase {
    children?: Schema[]
  }

  export interface CompMeta extends CompMetaBase {
    slots?: SlotDef[]
  }
  
  export interface Schema extends CompSchemaBase {
    slots?: SlotSchema[]
  }
  
  export type RenderProps<T extends Record<string, any> = Record<string, any>, I = any> = {
    style?: CSSProperties;
    classNames?: string;
    instance?: I
    updateState? :(name: string, value?: any) => void
    slots?: SlotSchema[] // TODO: 存疑，slot 应该有 instance?
  } & T
  
  
  export interface Def<P extends Record<string, any> = any, I = any> extends CompDefBase<Schema>, CompMeta {
    render?: (props: RenderProps<P, I>) => JSX.Element | null
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
  pureComps: CompSchemaBase[]
  bindings: BindingSchema[]
  
}

export type JsonSchemaTypes = {
  compMetaBase: CompMetaBase
  uiCompMeta: UIComp.CompMeta
}

export interface DesignSchema extends BindingScopeSchema {
  
}