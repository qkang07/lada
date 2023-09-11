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
import SidePane from "@/components/SidePane";
import { UIComp } from "@/libs/core/Def";

type Props = {
  schemas: UIComp.Schema[];
  onAdd: (ds: UIComp.Schema) => void;
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

  const add = () => {
    form.setFieldsValue({
      type: "var",
      name: "new data source",
      initValue: "",
    });
    setNewVisible(true);
  };

  const saveNew = () => {
    const values: any = form.getFieldsValue();

    console.log(values);
    props.onAdd(values);
    setNewVisible(false);
  };

  return (
    <SidePane
      title="数据"
    >
        <Popover
          title="编辑数据源"
          position="rt"
          popupVisible={newVisible}
          triggerProps={{
            autoFitPosition: false,
            popupStyle: {
              width: 480,
            },
          }}
          content={
            <div className={styles.newPop}>
              <Form
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
              </div>
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
        {schemas.map((ds, i) => {
          return (
            <div key={i} className={styles.dataSourceItem}>
              <span className={styles.dsName}>{ds.name}</span>
              <span className={styles.dsType}>{ds.label}</span>
            </div>
          );
        })}
      </div>
    </SidePane>
  );
};

export default DataSources;
