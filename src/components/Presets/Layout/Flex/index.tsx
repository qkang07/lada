import SlotHolder from "@/components/SlotHolder"
import { UIComp } from "@/libs/core/Def"

type FlexLayoutProps = {
  align: 'center' | 'top' | 'bottom'
  justify: 'start' | 'center' |'end'
}

const FlexLayout : UIComp.Def<FlexLayoutProps> = {
  name: 'flexLayout',
  label: '自适应行布局',
  slots: [
    {
      name: 'default' ,
      single: false
    }
  ],
  props: [
    {
      name: 'align',
      label: '纵向对齐',
      valueType: 'string',
      editor: {type:'radio', options: ['top','center','bottom']}
    },{
      name: 'justify',
      label: '横向对齐',
      valueType: 'string',
      editor: {type:'radio', options: ['start','center','end']}

    }
  ],
  render(props) {
    return <div {...props.domAttrs}
      style={{
        display: 'flex',
        alignItems: props.align,
        justifyContent: props.justify
      }}
    >
      <SlotHolder schema={props.slots?.[0]} />
    </div>
  }
}