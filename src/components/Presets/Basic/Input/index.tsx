import { UIComp } from "@/libs/core/Def"
import { Input } from "@arco-design/web-react"
import { action, makeAutoObservable } from "mobx"
import { useEffect, useState } from "react"


type InputProps = {
  maxLength?: number
  value?: any
  setValue?: (v: any) => void
  onChange?: (v: string) => void
}


const InputDef: UIComp.Def<InputProps> = {
  name: 'input',
  label: '输入框',

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
    return <Input value={value} onChange={handleChange} maxLength={maxLength} className={classNames}  />
  },
  props: [
    {
      name: 'value',
      type: 'string'
    }
  ],
  states: [
    {
      name: 'value',
      type: 'string'
    }
  ],
  events: [
    {
      name: 'onChange',
      payload: 'string'
    }
  ]

}

export default InputDef