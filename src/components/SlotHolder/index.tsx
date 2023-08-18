import React, { CSSProperties, useContext, useEffect, useMemo, useState } from "react";
import styles from "./index.module.less";
import { BindingSchema, UIComp } from "../../libs/core/Def";
import { CanvasContext } from "../Canvas";
import { DesignerContext } from "@/components/Designer";
import Renderer from "../Renderer";
import { observer } from "mobx-react";

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
    <div 
    data-slot-name={slotSchema.name}
    >
    {/* {
      isDesign && <span
      data-slot-name={rtSchema.name}
      data-slot-id={rtSchema.id}
      data-slot-comp-id={rtSchema.comp.id}
      data-slot-tag="start"
    ></span>
    } */}
      

      {isDesign && !hasChildren && (
        <div className={styles.slotHolder}>Put something here</div>
      )}

      {/* {slotSchema.type === "loop" ? (
        slotBinding.map((value, i) => (
          <Renderer props={value} key={i} schema={rtSchema.children![0]!} />
        ))
      ) : (
        <></>
      )} */}

      {hasChildren &&
        slotSchema.children?.map((comp, i) => {
          return <Renderer schema={comp} key={i} />;
        })}
      {/* {
        isDesign && <span
        data-slot-name={rtSchema.name}
        data-slot-id={rtSchema.id}

        data-slot-comp-id={rtSchema.comp.id}
        data-slot-tag="end"
      ></span>
      }
       */}
    </div>
  );
});

export default SlotHolder;
