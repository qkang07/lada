import React, { ReactNode, createContext, useContext, useState } from "react";
import styles from "./index.module.less";
import { IconMinus, IconPlus } from "@arco-design/web-react/icon";
import { UIComp } from "@/libs/core/Def";
import { observer } from "mobx-react";
import SidePane from "@/components/SidePane";


type SlotClickHandler = (slot: UIComp.SlotSchema, comp: UIComp.Schema) => void

const TreeContext = createContext<{
  indent?: number;
  onNodeClick?: (node: UIComp.Schema, slot?: UIComp.SlotSchema) => void;
}>({});

type NodeProps = {
  schema: UIComp.Schema;
  // level: number
};

const TreeNode = observer((props: NodeProps) => {
  const { indent, onNodeClick } = useContext(TreeContext);
  const { schema } = props;
  const [expanded, setExpanded] = useState(true);
  const style = {
    // paddingLeft: props.level * (indent || 0)
  };
  return (
    <div className={`${styles.treeNode}`} style={{ ...style }}>
      <div className={styles.content}>
        <div className={styles.icon}>
          {!!schema.slots?.length && (
            <div
              className={styles.expander}
              onClick={() => {
                setExpanded(!expanded);
              }}
            >
              {expanded ? <IconMinus /> : <IconPlus />}
            </div>
          )}
        </div>
        <div className={styles.nodeTitle} onClick={() => onNodeClick?.(schema)}>
          {schema.provider}
        </div>
      </div>
      <div
        className={styles.children}
        style={{ display: expanded ? "block" : "none" }}
      >
        {schema.slots?.map((slot) => {
          return (
            <div className={styles.slot} key={slot.name}>
              <div className={styles.slotTitle} onClick={() => onNodeClick?.(schema, slot) }>{slot.name}</div>
              {slot.children?.map((s) => {
                return <TreeNode schema={s} key={s.id} />;
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
});

type Props = {
  onNodeClick?: (node: UIComp.Schema, slot?: UIComp.SlotSchema) => void;
  root: UIComp.Schema;
};

const TreeView = observer((props: Props) => {
  const { root, onNodeClick } = props;
  return (
    <SidePane title="UI组件树">

      <TreeContext.Provider
        value={{
          onNodeClick,
          indent: 10,
        }}
      >
        <div className={styles.treeView}>
          {root?.slots?.[0]?.children?.map((s) => {
            return <TreeNode key={s.id} schema={s} />;
          })}
        </div>
      </TreeContext.Provider>
    </SidePane>
  );
});

export default TreeView;
