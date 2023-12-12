import { extendDefs } from "@/libs/core/utils";
import { InputBaseDef, InputCommonProps } from "../common";
import { UIComp } from "@/libs/core/Def";
import { InputNumber } from "@arco-design/web-react";
import { useEffect, useState } from "react";

type NumberInputProps = {
  step?: number
  min?: number
  max?: number
  allowClear?: boolean
} & InputCommonProps<number>

const NumberInputDef = extendDefs<UIComp.Def<NumberInputProps>>(InputBaseDef('number'), {
  name: 'numberInput',
  label: '数字输入',
  props: [
    {
      name: 'step',
      valueType: 'number',
      editor: {type:'number'}
    },
    {
      name: 'min',
      valueType: 'number',
      editor: {type: 'number'}
    },
    {
      name: 'max',
      valueType: 'number',
      editor: {type: 'number'}
    }
  ],
  render(props) {
    const [lv, setLv] = useState(props.value)
    useEffect(() => {
      setLv(props.value)
    },[props.value])
    return <InputNumber
      {...props.domAttrs}
      value={lv}
      min={props.min}
      max={props.max}
      step={props.max}
      disabled={props.disabled}
      onChange={v => {
        if(props.readOnly) {
          return
        }
        props.onChange?.(v)
        setLv(v)

      }}
    />
  }
})

export default NumberInputDef