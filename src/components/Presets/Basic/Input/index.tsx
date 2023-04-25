import { CompDef } from "@/components/compDef"
import { Input } from "@arco-design/web-react"


type InputProps = {
  maxLength?: number
  value?: any
  onChange?: (v: any) => void
}


const InputDef: CompDef<InputProps> = {
  name: 'input',
  label: '输入框',

  render(props) {
    const {style, classNames, maxLength, value, onChange} = props
    return <Input value={value} onChange={onChange} maxLength={maxLength} className={classNames} />
  },
  props: [
    {
      name: 'value',
      type: 'any'
    }
  ],
  events: [
    {
      name: 'onChange',
      params: 'string'
    }
  ]

}

export default InputDef