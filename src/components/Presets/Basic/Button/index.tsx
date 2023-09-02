import { UIComp } from "@/libs/core/Def";
import { Button } from "@arco-design/web-react";
import { FinalButtonProps } from "@arco-design/web-react/es/Button/interface";
import { ReactNode, forwardRef, useEffect, useImperativeHandle, useState } from "react";

type ButtonProps = {
  onClick: () => any
  children?: ReactNode
  type?: FinalButtonProps['type']
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
    valueType: 'string'
  }, {

    name: 'disabled',
    label: '是否禁用',
    defaultValue: false,
    valueType: 'boolean',
    editor: {type: 'boolean'}
  }, {
    name: 'children',
    label: '内容',
    defaultValue: '按钮',
    valueType: 'string',
    editor: {type:'string'}
  }],
  events: [
    {
      name: 'onClick',
    }
  ],
  actions: [
    {
      name: 'setText'
    }
  ],
  create(ctx) {
    return {}
  },
  render: forwardRef(( props, ref) => {

    const [innerChild, setInnerChild] = useState(props.children || '按钮')
    useImperativeHandle(ref, () => {
      return {
        setText(text: string) {
          setInnerChild(text)
        }
      }
    },[])
    useEffect(() => {
      if(props.children) {
        setInnerChild(props.children)
      }
    },[props.children])
    return <Button type={props.type}
    onClick={props.onClick}>{innerChild}</Button>
  }),
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