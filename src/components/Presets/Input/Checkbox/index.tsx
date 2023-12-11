import { OptionType, UIComp } from "@/libs/core/Def";
import { extendDefs } from "@/libs/core/utils";
import { InputBaseDef, InputCommonProps } from "../common";
import { Checkbox } from "@arco-design/web-react";
import { useEffect, useState } from "react";

type CheckboxProps = {
  label?: string;
} & InputCommonProps<boolean>;

const CheckboxDef = extendDefs<UIComp.Def<CheckboxProps>>(InputBaseDef("any"), {
  name: "checkbox",
  label: "选择框",
  props: [
    {
      name: "label",
      label: "标签",
      valueType: "string",
      editor: { type: "string" },
    },
  ],
  render(props) {
    const [lv, setLv] = useState(!!props.value);
    useEffect(() => {
      setLv(!!props.value);
    }, [props.value]);
    return (
      <Checkbox
        {...props.domAttrs}
        checked={lv}
        disabled={props.disabled}
        onChange={(e) => {
          if (props.readOnly) {
            return;
          }
          setLv(e);
          props.onChange?.(e);
        }}
      >
        {props.label}
      </Checkbox>
    );
  },
});

export default CheckboxDef;
