import { UIComp } from "@/libs/core/Def";
import { InputBaseDef, InputCommonProps } from "../common";
import { Switch } from "@arco-design/web-react";
import { extendDefs } from "@/libs/core/utils";
import { useEffect, useState } from "react";


type SwitchProps = {
  
} & InputCommonProps

const SwitchDef = extendDefs<UIComp.Def<SwitchProps>>(InputBaseDef('boolean'), {
  name: 'switch',
  props: [
    {
      name: 'value',
      label: '值',
      valueType: 'boolean',
      defaultValue: false,
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
    const [v, setV] = useState(!!props.value)
    useEffect(() => {
      setV(props.value)
    },[props.value])
    return <Switch checked={v} onChange={v=> {
      setV(v)
      props.onChange?.(v)
      props.updateState?.('value', v)
    }}/>
  }
  
})

export default SwitchDef