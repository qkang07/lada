import { OptionType, UIComp } from "@/libs/core/Def";
import { InputBaseDef, InputCommonProps } from "../common";
import { extendDefs } from "@/libs/core/utils";
import { Radio } from "@arco-design/web-react";
import { useEffect, useState } from "react";
import { nrmlzOptions } from "@/utils";

type RadioGroupProps = {
  options: OptionType[]
} & InputCommonProps<any>

const RadioGroupDef = extendDefs<UIComp.Def<RadioGroupProps>>(InputBaseDef('any'), {
  name: 'radioGroup',
  label: '单选组',
  props: [
    {
      name: 'options',
      label: '选项',
      valueType: 'array',
      editor:{type: 'options'},
      defaultValue: () => [] 
    }
  ],
  render(props) {
    const [lv, setLv] = useState(props.value)
    useEffect(() => {
      setLv(props.value)
    },[props.value])
    return <Radio.Group {...props.domAttrs}
      disabled={props.disabled}
    options={nrmlzOptions(props.options)}
      value={lv}
      onChange={e => {
        if(props.readOnly) {
          return
        }
        setLv(e)
        props.onChange?.(e)
      }}
    />
  }
})


export default RadioGroupDef