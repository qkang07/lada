import { UIComp } from "@/libs/core/Def"
import { Input } from "@arco-design/web-react"
import { useEffect, useState } from "react"


type SelectProps = {
  maxLength?: number
  value?: any
  setValue?: (v: any) => void
  onChange?: (v: string) => void
}


const InputDef: UIComp.Def<SelectProps> = {
  name: 'select',
  label: '下拉选择',

  // create(ctx) {
  //   const store = makeAutoObservable({
  //     value: undefined
  //   })
  //   const setValue = (v: any) => {
  //     store.value = v
  //     ctx.emit('change', v)
  //   }
  //   return  makeAutoObservable({
  //     setValue,
  //     value: store.value
  //   })
  // },
  props: [
    {
      name: 'value',
      valueType: 'string'
    },
    {
      name: 'options',
      valueType: 'array',
      editor: {type: 'options'}
    }
  ],
  states: [
    {
      name: 'value',
      valueType: 'string'
    }
  ],
  events: [
    {
      name: 'onChange',
      valueType: 'string'
    }
  ],

  render(props) {
    const {style, classNames, maxLength, value, onChange, updateState} = props
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
    return <Input value={innerValue} onChange={handleChange} maxLength={maxLength} className={classNames}  />
  },


}

export default InputDef