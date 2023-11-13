import React, { CSSProperties, useContext, useEffect, useMemo, useState } from "react";
import styles from "./index.module.less";
import { BindingSchema, UIComp } from "../../libs/core/Def";
import { DesignerContext } from "@/components/Designer";
import Renderer from "../Renderer";
import { observer } from "mobx-react";
import { Button } from "@arco-design/web-react";
import { IconEdit } from "@arco-design/web-react/icon";

type Props = {
  // name?: string
  // compId: string
  schema?: UIComp.SlotSchema;
  style?: CSSProperties;
  className?: string;
  props?: any;
};

const SlotHolder = observer((props: Props) => {
  const { schema: slotSchema } = props;

  const { isDesign } = useContext(DesignerContext);

  const hasChildren = !!props.schema?.children?.length;

  if(!slotSchema) {
    return <></>
  }

  

  return (
    <>
    {
      isDesign && <span
      data-slot-name={slotSchema.name}
      data-slot-tag="start"
    ></span>
    }
      

      {isDesign && !hasChildren && (
        <div className={styles.slotHolder}>
          <span>添加内容</span>
          <Button type='text' icon={<IconEdit/>}>手动编辑</Button>
        </div>
      )}

      {/* {slotSchema.type === "loop" ? (
        slotBinding.map((value, i) => (
          <Renderer props={value} key={i} schema={rtSchema.children![0]!} />
        ))
      ) : (
        <></>
      )} */}
      {
        slotSchema.text ? slotSchema.text : (hasChildren &&      slotSchema.children?.map((comp, i) => {
          return <Renderer slot={slotSchema} schema={comp} key={i} />;
        }))
      }

      {
        isDesign && <span
        data-slot-name={slotSchema.name}
        data-slot-tag="end"
      ></span>
      }
      
    </>
  );
});

export default SlotHolder;
