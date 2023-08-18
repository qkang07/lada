import SidePane from "@/components/SidePane";
import {
  // BindScopeEnum,
  // BindTypeEnum,
  // BindingSchema,
} from "@/libs/core/Def";
import { DesignerContext } from "@/components/Designer";
import { Input, Radio, Select, Switch } from "@arco-design/web-react";
import React, { useContext, useEffect, useState } from "react";
import pstyle from "../index.module.less";
import { observer } from "mobx-react";
import { action, autorun, makeAutoObservable } from "mobx";

type Props = {
};

const CustomPropsEditor = observer((props: Props) => {

  const { currentCompAgent } = useContext(DesignerContext);

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
        // const binding = compSchema?.?.find(
        //   (b) => b.prop === prop.name
        // );
        const value = compSchema?.defaultProps?.[prop.name]
        const editor =
          typeof prop.editor === "string" ? { type: prop.editor } : prop.editor;

        return (
          <div className={pstyle.propField} key={prop.name}>
            <span className={pstyle.label}>{prop.label || prop.name}</span>
            {editor?.type === "input" && (
              <Input
                size="small"
                value={value}
                onChange={(v) => {
                  handlePropChange(prop.name, v);
                }}
              />
            )}
            {editor?.type === "select" && (
              <Select
                size="small"
                options={editor.config}
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
                {editor.config.map((option: any) => {
                  return <Radio key={option.value} value={option.value}>{option.label}</Radio>;
                })}
              </Radio.Group>
            )}
            {editor?.type === 'boolean' && (
              <Switch checked={!!value} onChange={(v) => {
                handlePropChange(prop.name, v)
              }}/>
            )}
          </div>
        );
      })}
    </SidePane>
  );
});

export default CustomPropsEditor;
