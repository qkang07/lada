import { OptionType, UIComp } from "@/libs/core/Def"
import { Input, Select } from "@arco-design/web-react"
import { forwardRef, useEffect, useImperativeHandle, useState } from "react"


type SelectProps = {
  maxLength?: number
  value?: any
  multiple?: boolean
  options?: OptionType[]
  setValue?: (v: any) => void
  onChange?: (v: string) => void
}


const SelectDef: UIComp.Def<SelectProps> = {
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
    },{
      name: 'multiple',
      valueType: 'boolean',
      defaultValue: false,
      editor: {type:'boolean'}
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
  actions: [
    {
      name: 'setValue',
      valueType: 'any'
    }
  ],

  render: forwardRef((props, ref) => {
    const { maxLength, value, onChange, updateState} = props
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

    useImperativeHandle(ref, () => {
      return {
        setValue: (v: any) => {
          handleChange(v)
        }
      }
    })
    
    return <Select value={innerValue} onChange={handleChange} mode={props.multiple ? 'multiple' : undefined} {...props.domAttrs} />
  }),


}

export default SelectDef