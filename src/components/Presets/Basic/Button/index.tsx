import { UIComp } from "@/components/compDef";
import { Button } from "@arco-design/web-react";
import { ReactNode } from "react";

type ButtonProps = {
  onClick: () => any
  children?: ReactNode
  type?: string
}

const ButtonDef: UIComp.Def<ButtonProps> = {
  name:'button',
  label: '按钮',
  props: [{
    name: 'type',
    label: '类型',
    defaultValue: 'default',
    editor: {
      type: 'select',
      config: ['default','primary','secondary','dashed','text','outline'].map(c => ({label: c, value: c}))
    },
    type: 'string'
  }, {

    name: 'disabled',
    label: '是否禁用',
    defaultValue: false,
    type: 'boolean',
    editor: {type: 'boolean'}
  }],
  events: [
    {
      name: 'onClick',
    }
  ],
  create(ctx) {
    return {}
  },
  render: (props) => {
    return <Button type={props.type as any}
    onClick={props.onClick}>{props.children}</Button>
  },
  createSchema(schema: UIComp.Schema) {
    
    // schema.bindings = [
    //   {
    //     prop: 'children',
    //     scope: BindScopeEnum.Direct,
    //     type: BindTypeEnum.Model,
    //     binding: '按钮'
    //   },{
    //     prop: 'type',
    //     scope: BindScopeEnum.Direct,
    //     type: BindTypeEnum.Model,
    //     binding: 'default'
    //   }
    // ]
    return schema
  }
}

export default ButtonDef