import { UIComp } from "@/libs/core/Def";
import { Space } from "@arco-design/web-react";

const SpaceDef: UIComp.Def = {
  name: 'space',
  label: '间隔容器',
  props: [
    {
      name: 'direction',
      valueType: 'string'
    }
  ],
  slots: [
    {
      name: 'default'
    }
  ],
  render(props) {

    return <Space></Space>
  }
}

export default SpaceDef