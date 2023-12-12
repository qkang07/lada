import styles from './index.module.less'
import SidePane from "@/components/SidePane";
import { DesignerContext } from "@/components/Designer";
import { Input, Radio, Select, Switch, Button, InputNumber } from "@arco-design/web-react";
import React, { ReactNode, useContext, useEffect, useState } from "react";
import pstyle from "../index.module.less";
import { observer } from "mobx-react";
import { action, autorun } from "mobx";
import { IconLink } from '@arco-design/web-react/icon';
import PresetEditor from '../PresetEditor';







type Props = {
};

const CustomPropsEditor = observer((props: Props) => {

  const { currentCompAgent, openBinding, bdCon } = useContext(DesignerContext);

  const compSchema = currentCompAgent?.schema
  const compDef = currentCompAgent?.def

  const handlePropChange = action((name: string, value: any) => {
    currentCompAgent?.updateDefaultProp(name, value)
  });
  return (
    <SidePane title={"自定义属性"}>
      {compDef?.props?.map((prop) => {

        const bound = bdCon?.schema?.bindings.some(bd => bd.type === 'state-prop' && bd.target.id === compSchema?.id && bd.target.prop === prop.name)

        return (
          <div className={pstyle.propField} key={prop.name}>
            <div className={pstyle.title}>
              <span className={pstyle.label}>{prop.label || prop.name}</span>

              <div className={styles.bd}>
                <Button type={bound ? 'primary' : 'secondary'} size="mini" icon={<IconLink  />} onClick={() => {
                  openBinding?.('state', prop.name)
                }} ></Button>
                
              </div>
            </div>
            <div className={pstyle.content}>
              
              <PresetEditor prop={prop} disabled={bound}/>

            </div>
          </div>
        );
      })}
    </SidePane>
  );
});

export default CustomPropsEditor;
