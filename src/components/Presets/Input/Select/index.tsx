import { OptionType, UIComp } from "@/libs/core/Def"
import { extendDefs } from "@/libs/core/utils"
import { Input, Select } from "@arco-design/web-react"
import { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import { InputBaseDef, InputCommonProps } from "../common"


type SelectProps = {
  maxLength?: number
  multiple?: boolean
  options?: OptionType[]
  setValue?: (v: any) => void
} & InputCommonProps


const SelectDef = extendDefs<UIComp.Def<SelectProps> >(InputBaseDef('any'), {
  name: 'select',
  label: '下拉选择',


  props: [
   
    {
      name: 'options',
      valueType: 'array',
      defaultValue: () => [
        {
          value: 'value',
          label: 'label'
        }
      ],
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


})

export default SelectDef