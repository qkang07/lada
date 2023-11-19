import { UIComp } from "@/libs/core/Def";
import { Divider } from "@arco-design/web-react";


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
      valueType: 'string',
      editor: {
        type: 'radio',
        options: [
          {label: '水平',value: 'horizontal'},
          {label: '竖直',value: 'vertical'},
        ]
      }
    }
    ,
    {
      name: 'orientation',
      label:"分割线文字位置",
      valueType: 'string',
      editor: {
        type: 'select',
        options: ['left','right','center']
      }
    }
  ],
  render(props) {
    return <Divider orientation={props.orientation}
      type={props.type}
      {...props.domAttrs}
    />
  }
}

export default DividerDef