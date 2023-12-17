import { CSSProperties, ReactNode } from 'react';
import type { CompAgent } from './CompAgent';

export type DescBase = {
  name: string
  label?: string
  desc?: string
}

export interface EventActionDef extends DescBase {
  valueType?: ValueType

}


export type TextType = number | string

export type PrimitiveType = TextType | boolean 

export type OptionType = {value: TextType, label?: string}


// 这个是内置的属性编辑器。
export interface PropEditorBase  {
  type: string // 'string' | 'select' | 'radio' | 'boolean' | 'number' | 'textarea' | 'options',
  config?: Record<string, any>
}

export interface SelectEditorType extends PropEditorBase {
  type: 'select' | 'radio' | 'checkbox',
  options: OptionType[] | string[] | number[]
  config?: {
    multiple?: boolean
  }
}

export interface NumberEditorType extends PropEditorBase {
  type: 'number',
  config?: {
    max?: number
    min?: number
    step?: number
  }
}

export interface StringEditorType extends PropEditorBase {
  type: 'string' | 'textarea',
  config?: {
    maxLength?: number
    pattern?: string
  }
}

export interface OtherEditorType extends PropEditorBase {
  type: 'boolean' | 'options' | 'void',
}



export type PropEditorType = SelectEditorType | NumberEditorType | StringEditorType | OtherEditorType

export type ValueType = 'string' | 'number' | 'boolean' | 'record' | 'array' | 'any' | 'void'

export type PropEditorRenderType<T = any> = (props: {
  value: T,
  onChange: (value: T) => void
}) => ReactNode


export interface StatePropDef extends DescBase  {
  editor?: PropEditorType // 需要预设的编辑器
  editorRender?: string | PropEditorRenderType
  valueType?: ValueType
  defaultValue?: string | number | boolean | (() => any)
  required?: boolean
}


export interface CompSchemaBase extends DescBase {
  id: string // comp schema 也需要ID，为的是在 schema 中定位。区别于 comp instance 的 id
  provider: string
  defaultProps: Record<string, any>
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


export interface CompPropSchema extends DescBase {
  defaultValue?: any
  type?: ValueType
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




export namespace PureComp {
  export interface Schema extends CompSchemaBase {

  }
  export interface Def<P extends Record<string, any> = Record<string, any>, I = any> extends CompDefBase<Schema>, CompMetaBase {
  };
}



export namespace UIComp {

  export type SlotType = 'single' | 'list' | 'loop'
  
  export interface SlotDef extends DescBase {
    placeholder?: string
    single?: boolean
    prop?: StatePropDef
  }
  export interface SlotSchema extends DescBase {
    children?: Schema[]
    text?: string
  }

  export interface CompMeta extends CompMetaBase {
    slots?: SlotDef[]
  }
  
  export interface Schema extends CompSchemaBase {
    slots?: SlotSchema[]
    style?: CSSProperties
    className?: string
  }
  
  export type RenderProps<T extends Record<string, any> = Record<string, any>, I = any> = {
    instance?: I
    updateState? :(name: string, value?: any) => void
    slots?: SlotSchema[] // TODO: 存疑，slot 应该有 instance?
    mode?: 'design' | 'runtime' | 'view' 
    // 需要绑定到 dom 上的东西
    domAttrs: {
      style: CSSProperties;
      classNames: string;
      'data-lada-schema-id': string
      'data-lada-agent-id': string
    }
  } & T
  
  
  export interface Def<P extends Record<string, any> = Record<string, any>, I = any> extends CompDefBase<Schema>, CompMeta {
    render: (props: RenderProps<P, I>) => JSX.Element
  };
}


export type DataFilterType = 'child' | 'format' | 'objMap' | 'arrayMap' | 'custom'
export interface Formatter extends DescBase {
  transformer: (input: any) => any
  valueType: ValueType

}
export interface DataFilterSchema extends DescBase {
  type: DataFilterType
  childPath?: string[]
  objMap?: Record<string, string>
  formatter?: string
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
  filters?: DataFilter[]
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