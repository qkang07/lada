import { PropEditorType, StatePropDef, UIComp, ValueType } from "@/libs/core/Def"

export type InputCommonProps<T = any> = {
  value?: T,
  onChange?: (val: T) => void,
  disabled?: boolean
  readOnly?: boolean

}

export const InputBaseDef = (type: ValueType, editor?: PropEditorType):UIComp.Def => {
  return {
    name: '',
    props: [
      {
        name: 'value',
        label: '值',
        valueType: type,
        editor
      }
    ],
    states: [
      {
        name: 'value',
        label: '值',
        valueType: type
      }
    ],
    events: [
      {
        name: 'onChange',
        label: '变更',
        valueType: type
      }
    ],
    render(){
      return <></>
    }
  }
}