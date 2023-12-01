import { UIComp } from "@/libs/core/Def";
import { InputBaseDef, InputCommonProps } from "../common";
import { Switch } from "@arco-design/web-react";
import { extendDefs } from "@/libs/core/utils";


type SwitchProps = {
  
} & InputCommonProps

const SwitchDef = extendDefs<UIComp.Def<SwitchProps>>(InputBaseDef('boolean'), {
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
  
})

export default SwitchDef