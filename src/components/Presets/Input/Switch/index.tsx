import { UIComp } from "@/libs/core/Def";
import { InputCommonProps } from "../common";
import { Switch } from "@arco-design/web-react";


type SwitchProps = {
  
} & InputCommonProps

const SwitchDef: UIComp.Def<SwitchProps> = {
  name: 'switch',
  props: [
    {
      name: 'value',
      label: '值',
      valueType: 'boolean',
      editor: {type:'boolean'}
    },
    {
      name: 'disabled'
    }
  ],
  events: [
    {
      name: 'onChange',
      valueType: 'boolean'
    }
  ],
  states: [
    {
      name: 'value',
      label: '值',
      valueType: 'boolean',
    }
  ],
  render(props) {
    return <Switch checked={props.value} onChange={v=> {
      props.onChange?.(v)
      props.updateState?.('value', v)
    }}/>
  }
  
}