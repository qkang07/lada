import styles from './index.module.less'
import SidePane from "@/components/UIKit/SidePane";
import { DesignerContext } from "@/components/Designer";
import { Input, Radio, Select, Switch, Button, InputNumber } from "@arco-design/web-react";
import React, { ReactNode, useContext, useEffect, useState } from "react";
import pstyle from "../index.module.less";
import { observer } from "mobx-react";
import { action, autorun } from "mobx";
import { IconLink } from '@arco-design/web-react/icon';
import PresetEditor from '../PresetEditor';
import PropField from '@/components/UIKit/Field';







type Props = {
};

const CustomPropsEditor = observer((props: Props) => {

  const { designerStore, bdCon  } = useContext(DesignerContext);

  const compSchema = designerStore.currentAgent?.schema
  const compDef = designerStore.currentAgent?.def

  return (
    <SidePane title={"自定义属性"}>
      {compDef?.props?.map((prop) => {

        const binding = bdCon?.schema?.bindings.find(bd => bd.type === 'state-prop' && bd.target.id === compSchema?.id && bd.target.prop === prop.name)

        return (
          <PropField
            prop={prop}
            bound={!!binding}
            onBind={() => {
              if(binding) {

                designerStore.setCurrentBinding(binding)
              }
              else {
                designerStore.setCurrentBinding({
                  source: {
                    id: compSchema?.id!,
                    prop: prop.name,
                    
                  },
                  type: 'state-prop'
                  
                })
              }
            }}
          >
              <PresetEditor prop={prop} disabled={!!binding}/>
          </PropField>
        );
      })}
    </SidePane>
  );
});

export default CustomPropsEditor;
