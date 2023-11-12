import SlotHolder from "@/components/SlotHolder";
import { UIComp } from "@/libs/core/Def";
import { Space } from "@arco-design/web-react";

type Props = {
  direction?: 'vertical' | 'horizontal'
  size?: number
}

const SpaceDef: UIComp.Def<Props> = {
  name: 'space',
  label: '间隔容器',
  props: [
    {
      name: 'direction',
      valueType: 'string',
      defaultValue: 'horizontal',
      editor: {type: 'radio', options: ['vertical','horizontal']}
    },
    {
      name: 'size',
      valueType: 'number',
      defaultValue: 20,
      editor: {type: 'number', config: {
        min: 0,
        step: 1
      }}
    }
  ],
  slots: [
    {
      name: 'default',
      single: false
    }
  ],
  onSchemaCreate(initSchema) {
    initSchema.slots = [{
      name: 'default',
      children: []
    }]
      return initSchema
  },
  render(props) {

    return <Space className={props.classNames} style={props.style} direction={props.direction} size={props.size}>
      <SlotHolder schema={props.slots?.[0]}/>
    </Space>
  }
}

export default SpaceDef