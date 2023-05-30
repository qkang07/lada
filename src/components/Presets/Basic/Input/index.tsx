import { UIComp } from "@/components/compDef"
import { Input } from "@arco-design/web-react"
import { action, makeAutoObservable } from "mobx"


type InputProps = {
  maxLength?: number
  value?: any
  setValue?: (v: any) => void
}


const InputDef: UIComp.Def<InputProps> = {
  name: 'input',
  label: '输入框',

  create(ctx) {
    const store = makeAutoObservable({
      value: undefined
    })
    const setValue = (v: any) => {
      store.value = v
      ctx.emit('change', v)
    }
    return  makeAutoObservable({
      setValue,
      value: store.value
    })
  },

  render(props) {
    const {style, classNames, maxLength, value, setValue} = props
    return <Input value={value} onChange={setValue} maxLength={maxLength} className={classNames}  />
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