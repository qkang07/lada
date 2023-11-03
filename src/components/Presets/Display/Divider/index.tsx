import { UIComp } from "@/libs/core/Def";


type DividerProps = {
  orientation?: 'left' | 'right' | 'center'
  type?: 'horizontal' | 'vertical'

}

const DividerDef: UIComp.Def<DividerProps> = {
  name: 'divider',
  label: '分割线',
  props: [
    {
      name: 'type',
      label: '类型',
      valueType: 'enum',
      editor: {
        type: 'radio',
        config: [
          {label: '水平',value: 'horizontal'},
          {label: '竖直',value: 'vertical'},
        ]
      }
    }
    ,
    {
      name: 'orientation',
      label:"分割线文字位置",
      valueType: 'enum',
      editor: {
        type: 'select',
        config: ['left','right','center']
      }
    }
  ]
}