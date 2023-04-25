import SlotHolder from "@/components/SlotHolder";
import { CompDef } from "@/components/compDef";
import { Typography } from "@arco-design/web-react";

type PProps = {
}


const ParagraphDef: CompDef<PProps> = {
  name: 'paragraph',
  label: '段落',
  props: [],
  slots: [{
    name: 'default',
    type: 'single'
  }],
  render: (props) => {
    return <Typography.Paragraph>
      <SlotHolder schema={props.slots?.[0]} />
     </Typography.Paragraph>
  }
}

export default ParagraphDef