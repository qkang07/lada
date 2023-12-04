import { UIComp } from "@/libs/core/Def"
import { Input } from "@arco-design/web-react"
import { useEffect, useState } from "react"

import meta from './uimeta.json'


type InputProps = {
  maxLength?: number
  value?: any
  setValue?: (v: any) => void
  onChange?: (v: string) => void
}


const InputDef: UIComp.Def<InputProps> = {
  // meta: meta as UIComp.CompMeta,
  ...(meta as UIComp.CompMeta),


  render(props) {
    const {maxLength, value, onChange, updateState} = props
    const [innerValue, setInnerValue] = useState(props.value || '')
    useEffect(() => {
      if(value !== undefined && value !== null) {
        setInnerValue(value)
      }
    }, [value])
    const handleChange = (v: string) => {
      setInnerValue(v)
      onChange?.(v)
      updateState?.('value', v)
    }
    return <Input value={innerValue} onChange={handleChange} maxLength={maxLength}
      {...props.domAttrs}
    />
  },

}

export default InputDef