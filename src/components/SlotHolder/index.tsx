import React, { CSSProperties, useContext, useEffect, useMemo, useState } from "react";
import styles from "./index.module.less";
import { BindingSchema, SlotRuntime, SlotSchema } from "../compDef";
import { compMan } from "../manager";
import { CanvasContext } from "../Canvas";
import { DesignerContext } from "@/pages/Designer";
import Renderer from "../Renderer";
import { observer } from "mobx-react";

type Props = {
  // name?: string
  // compId: string
  schema?: SlotRuntime;
  style?: CSSProperties;
  className?: string;
  props?: any;
};

const SlotHolder = observer((props: Props) => {
  const { schema: slotSchema } = props;

  const [rtSchema, setRTSchema] = useState(props.schema)
  const { compSchemaMap, isDesign, slotSchemaMap } = useContext(DesignerContext);
  const { processBinding } = useContext(CanvasContext);

  /**** design time functions */
  const updateSchema = () => {
    console.log('update slot', slotSchemaMap)
    setRTSchema(slotSchemaMap![slotSchema?.id!])
    console.log('current slot schema', slotSchema)
  }

  const updateBinding = (binding: BindingSchema) => {
    rtSchema!.binding = binding
    // slotSchema!.binding = binding
    updateSchema()
  }


  const hasChildren = !!props.schema?.children?.length;

  if(!rtSchema) {
    return <></>
  }

  const slotBinding: any[] = useMemo(() => {
    if (rtSchema.binding) {
      return processBinding(rtSchema.binding) || [];
    }
    return [];
  }, [props.schema?.binding]);




  return (
    <div 
    data-slot-name={rtSchema.name}
    data-slot-id={rtSchema.id}
    data-slot-comp-id={rtSchema.comp.id}
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

      {rtSchema.type === "loop" ? (
        slotBinding.map((value, i) => (
          <Renderer props={value} key={i} schema={rtSchema.children![0]!} />
        ))
      ) : (
        <></>
      )}

      {hasChildren &&
        rtSchema.children?.map((comp, i) => {
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
