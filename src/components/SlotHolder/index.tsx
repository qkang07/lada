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
  slotTag?: keyof HTMLElementTagNameMap
  className?: string;
  props?: any;
  children?: ReactNode;
  placeholder?: string
  editable?: boolean // TODO: 可直接编辑的 slot
};

const SlotHolder = observer((props: Props) => {
  const { schema: slotSchema, className, style } = props;

  const { isDesign, currentSlot, currentCompAgent } = useContext(DesignerContext);

  if (!slotSchema) {
    return <></>;
  }

  const showText = !!slotSchema.text;

  const showSlotContent = !showText && !!slotSchema.children?.length;

  const showDefaultContent = !showText && !showSlotContent && !!props.children;

  const showDesignHolder = isDesign && !showText && !showSlotContent && !showDefaultContent  ;

  const renderChildren: ReactNode[] = []

  const isActive = isDesign && currentSlot?.schema === slotSchema

  // console.log('slott active', isActive, currentSlot, slotSchema)

  if(showText) {
    renderChildren.push(slotSchema.text)
  }
  if(showSlotContent) {
    renderChildren.push(...slotSchema.children!.map((comp, i) => {
      return <Renderer slot={slotSchema} schema={comp} key={i} />;
    }))
  }
  if(showDefaultContent) {
    renderChildren.push(props.children)
  }
  if(showDesignHolder) {
    renderChildren.push(<div className={styles.slotPlaceholder}>
      <span>{props.placeholder || '添加内容'}</span>
      {/* <Button type="text" icon={<IconEdit />}>
        手动编辑
      </Button> */}
    </div>)
  }

  return React.createElement(props.slotTag || 'div', {
    className: `slot-holder ${isActive ? 'slot-holder-active' : ''} ${className || ''}`,
    'data-slot-name': slotSchema.name,
    style: {...style}
  }, ...renderChildren);
  //  (
  //   <div className={`slot-holder ${className}`} style={{...style}} data-slot-name={slotSchema.name}>
  //     {showText && slotSchema.text}
  //     {showSlotContent &&
  //       slotSchema.children?.map((comp, i) => {
  //         return <Renderer slot={slotSchema} schema={comp} key={i} />;
  //       })}

  //     {showDefaultContent && props.children}
  //     {showDesignHolder && (
  //       <div className={styles.slotHolder}>
  //         <span>添加内容</span>
  //         <Button type="text" icon={<IconEdit />}>
  //           手动编辑
  //         </Button>
  //       </div>
  //     )}
  //   </div>
  // );

  // NOTE： 这个版本认为 slot holder 不应该有自己的 dom。
  // return (
  //   <>
  //     {isDesign && (
  //       <span data-slot-name={slotSchema.name} data-slot-tag="start"></span>
  //     )}

  //     {isDesign && !hasChildren && (
  //       <div className={styles.slotHolder}>
  //         <span>添加内容</span>
  //         <Button type="text" icon={<IconEdit />}>
  //           手动编辑
  //         </Button>
  //       </div>
  //     )}

  //     {showText && slotSchema.text}
  //     {showSlotContent &&
  //       slotSchema.children?.map((comp, i) => {
  //         return <Renderer slot={slotSchema} schema={comp} key={i} />;
  //       })}

  //     {showDefaultContent && props.children}

  //     {isDesign && (
  //       <span data-slot-name={slotSchema.name} data-slot-tag="end"></span>
  //     )}

  //     {
  //       isDesign && <div className={styles.slotFrame}>

  //       </div>
  //     }
  //   </>
  // );
});

export default SlotHolder;
