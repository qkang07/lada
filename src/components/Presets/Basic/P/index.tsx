import SlotHolder from "@/components/SlotHolder";
import { UIComp } from "@/libs/core/Def";
import { Typography } from "@arco-design/web-react";

type PProps = {
}


const ParagraphDef: UIComp.Def<PProps> = {
  name: 'paragraph',
  label: '段落',
  props: [],
  slots: [{
    name: 'default',
    single: true
  }],
  onSchemaCreate(initSchema) {
    initSchema.slots = [{
      name: 'default',
      children: []
    }]
      return initSchema
  },
  render: (props) => {
    return <Typography.Paragraph {...props.domAttrs}>
      <SlotHolder schema={props.slots?.[0]} />
     </Typography.Paragraph>
  }
}

export default ParagraphDef