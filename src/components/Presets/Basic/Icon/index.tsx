import { UIComp } from "@/libs/core/Def";
import { Input } from "@arco-design/web-react";
import * as ArcoIcon from '@arco-design/web-react/icon'
import { ReactNode } from "react";

type IconProps = {
  name: string
}

const IconDef: UIComp.Def<IconProps> = {
  name: 'icon',
  label: '图标',
  props: [
    {
      name: 'name',
      label: '图标',
      valueType: 'string',
      editorRender(props) {
        // TODO
        return <div>
          <Input value={props.value} onChange={props.onChange}/>
          <div>
            当前选择：
          </div>
          <div>

          </div>
        </div>
      }
    }
  ],
  render(props) {
    const Icon: (p: any) => JSX.Element = (ArcoIcon as Record<string ,any>)[props.name]
    if(Icon) {
      return <Icon className={props.classNames} style={props.style} />
    }
    return <></>

  }
}