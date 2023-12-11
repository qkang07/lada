import { OptionType, UIComp } from "@/libs/core/Def";
import { InputBaseDef, InputCommonProps } from "../common";
import { extendDefs } from "@/libs/core/utils";
import { Checkbox } from "@arco-design/web-react";
import { nrmlzOptions } from "@/utils";
import { useEffect, useState } from "react";

type CheckboxGroupProps = {
  options: OptionType[]
} & InputCommonProps<any[]>

const CheckboxGroupDef = extendDefs<UIComp.Def<CheckboxGroupProps>>(InputBaseDef('array'), {
  name: 'checkbox-group',
  label: '选择框组',
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
    const [lv, setLv] = useState(props.value || [])
    useEffect(() => {
      setLv(props.value || [])
    },[props.value])
    return <Checkbox.Group {...props.domAttrs}
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

export default CheckboxGroupDef