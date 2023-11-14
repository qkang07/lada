import React, {
  CSSProperties,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
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
  children?: ReactNode;
};

const SlotHolder = observer((props: Props) => {
  const { schema: slotSchema } = props;

  const { isDesign } = useContext(DesignerContext);

  const hasChildren = !!props.schema?.children?.length;

  if (!slotSchema) {
    return <></>;
  }


  const showText = !!slotSchema.text;

  const showSlotContent = !showText && !!slotSchema.children?.length;

  const showDefaultContent = !showText && !showSlotContent && !!props.children;

  const showDesignHolder = isDesign

  return (
    <>
      {isDesign && (
        <span data-slot-name={slotSchema.name} data-slot-tag="start"></span>
      )}

      {isDesign && !hasChildren && (
        <div className={styles.slotHolder}>
          <span>添加内容</span>
          <Button type="text" icon={<IconEdit />}>
            手动编辑
          </Button>
        </div>
      )}

      {showText && slotSchema.text}
      {showSlotContent &&
        slotSchema.children?.map((comp, i) => {
          return <Renderer slot={slotSchema} schema={comp} key={i} />;
        })}

      {showDefaultContent && props.children}

      {isDesign && (
        <span data-slot-name={slotSchema.name} data-slot-tag="end"></span>
      )}

      {
        isDesign && <div className={styles.slotFrame}>
          
        </div>
      }
    </>
  );
});

export default SlotHolder;
