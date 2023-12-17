import React, { useState } from "react";
import styles from "./index.module.less";
import {
  Button,
  Form,
  Input,
  Popover,
  Select,
  Space,
  Trigger,
} from "@arco-design/web-react";
import { IconPlus } from "@arco-design/web-react/icon";
import SidePane, { SidePaneItem } from "@/components/UIKit/SidePane";
import { CompSchemaBase, UIComp } from "@/libs/core/Def";
import { compMan } from "@/components/CompManager/manager";

type Props = {
  schemas?: CompSchemaBase[];
  onAdd: (provider: string) => void;
  onChoose?: (id: string) => void
};

const DSTypes: {
  label: string;
  value: string;
}[] = [
  { label: "HTTP", value: "http" },
  { label: "变量", value: "var" },
  // { label: "环境变量", value: "getter" },
];

const DataSources = (props: Props) => {
  const { schemas } = props;

  const [form] = Form.useForm();

  const [newVisible, setNewVisible] = useState(false);
  const [newType, setNewType] = useState("var");

  const dsTypes = ['http', 'var']

  const add = () => {
    setNewVisible(true);
  };


  return (
    <SidePane
      title="数据"
    >
        <Popover
          title="编辑数据源"
          // position="rt"
          // popupVisible={newVisible}
          trigger={'click'}
          triggerProps={{
            // autoFitPosition: false,
            // popupStyle: {
            //   width: 480,
            // },
          }}
          content={
            <div className={styles.newPop}>
              {/* <Form
                form={form}
                onValuesChange={(v) => {
                  if (v.type) {
                    setNewType(v.type);
                  }
                }}
                size="small"
              >
                <Form.Item label="名称" field={"name"}>
                  <Input autoFocus />
                </Form.Item>
                <Form.Item label="类型" field={"type"}>
                  <Select options={DSTypes} />
                </Form.Item>
              </Form>
              <div className={styles.dsEditFooter}>
                <Space align="end">
                  <Button
                    type="text"
                    size="small"
                    onClick={() => setNewVisible(false)}
                  >
                    取消
                  </Button>
                  <Button type="primary" size="small" onClick={saveNew}>
                    保存
                  </Button>
                </Space>
              </div> */}
              {dsTypes.map(dst=>{
                return <Button key={dst} className={styles.dsType} onClick={() => {
                  props.onAdd?.(dst)
                }}>
                  {dst}
                </Button>
              })}
            </div>
          }
        >
          <Button
            icon={<IconPlus />}
            size="small"
            type="text"
            onClick={add}
          ></Button>
        </Popover>
      <div className={styles.dsList}>
        {schemas?.map((ds, i) => {
          return (
            <SidePaneItem onClick={() => {
              props.onChoose?.(ds.id)
            }} key={i} className={styles.dataSourceItem}>
              <span className={styles.dsName}>{ds.name}</span>
              <span className={styles.dsType}>{ds.provider}</span>
            </SidePaneItem>
          );
        })}
      </div>
    </SidePane>
  );
};

export default DataSources;
