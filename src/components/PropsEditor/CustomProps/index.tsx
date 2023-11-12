import styles from './index.module.less'
import SidePane from "@/components/SidePane";
import { OptionType, PrimitiveType } from "@/libs/core/Def";
import { DesignerContext } from "@/components/Designer";
import { Input, Radio, Select, Switch, Button, InputNumber } from "@arco-design/web-react";
import React, { ReactNode, useContext, useEffect, useState } from "react";
import pstyle from "../index.module.less";
import { observer } from "mobx-react";
import { action, autorun, makeAutoObservable } from "mobx";
import { IconLink } from '@arco-design/web-react/icon';




function nrmlzOptions(options:OptionType[]) {
  if(!options || !(options instanceof Array)) {
    console.warn('invalid options value!', options)
    return []
  }
  console.log(options)
  return options.map(item => {
    if(typeof item === 'object' && Reflect.has(item, 'value')) {
      const oitem = item as {value: PrimitiveType, label?: string | ReactNode}
      return {
        value: oitem.value,
        label: String(oitem.label || oitem.value)
      }
    }
    return {value: item, label: String(item)}

  })
}

type Props = {
};

const CustomPropsEditor = observer((props: Props) => {

  const { currentCompAgent, openBinding, bdCon } = useContext(DesignerContext);

  const compSchema = currentCompAgent?.schema
  const compDef = currentCompAgent?.def



  const handlePropChange = action((name: string, value: any) => {
    currentCompAgent?.updateDefaultProp(name, value)
    // const propDef = compDef!.props!.find(p => p.name === name)
    console.log("prop change", name, value);
    // let bind: BindingSchema | undefined = compSchema.bindings?.find(
    //   (b) => b.prop === name
    // );
    // if (!bind) {
    //   bind = makeAutoObservable({
    //     scope: BindScopeEnum.Direct,
    //     prop: name,
    //     type: BindTypeEnum.Model,
    //     binding: value,
    //   });
    //   compSchema.bindings?.push(bind);
    // } else {
    //   bind.binding = value;
    // }
    // updateCompSchema?.(compId, compSchema)
  });
  return (
    <SidePane title={"自定义属性"}>
      {compDef?.props?.map((prop) => {

        const bound = bdCon?.schema?.bindings.some(bd => bd.type === 'state-prop' && bd.target.id === compSchema?.id && bd.target.prop === prop.name)
        // const binding = compSchema?.?.find(
        //   (b) => b.prop === prop.name
        // );
        const value = compSchema?.defaultProps?.[prop.name] || prop.defaultValue
        const editor =
          typeof prop.editor === "string" ? { type: prop.editor } : prop.editor;

        return (
          <div className={pstyle.propField} key={prop.name}>

              <span className={pstyle.label}>{prop.label || prop.name}</span>
              <div className={pstyle.rightPart}>

                {editor?.type === "string" && (
                  <Input
                    size="small"
                    value={value}
                    onChange={(v) => {
                      handlePropChange(prop.name, v);
                    }}
                  />
                )}
                {editor?.type === "textarea" && (
                  <Input.TextArea
                    value={value}
                    onChange={(v) => {
                      handlePropChange(prop.name, v);
                    }}
                  />
                )}
                {editor?.type === "number" && (
                  <InputNumber
                    size="small"
                    value={value}
                    min={editor.config?.min}
                    max={editor.config?.max}
                    step={editor.config?.step}
                    onChange={(v) => {
                      handlePropChange(prop.name, v);
                    }}
                  />
                )}
                {editor?.type === "select" && (
                  <Select
                    size="small"
                    options={nrmlzOptions(editor.options)}
                    value={value}
                    onChange={(v) => {
                      handlePropChange(prop.name, v);
                    }}
                  />
                )}
                {editor?.type === "radio" && (
                  <Radio.Group
                    size="small"
                    value={value}
                    onChange={(v) => {
                      handlePropChange(prop.name, v);
                    }}
                  >
                    {editor.options.map((option: any) => {
                      return <Radio key={option.value} value={option.value}>{option.label}</Radio>;
                    })}
                  </Radio.Group>
                )}
                {editor?.type === 'boolean' && (
                  <Switch checked={!!value} onChange={(v) => {
                    handlePropChange(prop.name, v)
                  }}/>
                )}
                {editor?.type === 'options' && (
                  <Input.TextArea value={value} onChange={(v) => {
                    handlePropChange(prop.name, v)
                  }}/>
                )}


              <div className={styles.bd}>
                <Button type={bound ? 'primary' : 'secondary'} size="mini" icon={<IconLink  />} onClick={() => {
                  openBinding?.('state', prop.name)
                }} shape="circle"></Button>
                
              </div>
              </div>
          </div>
        );
      })}
    </SidePane>
  );
});

export default CustomPropsEditor;
