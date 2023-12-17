import { UIComp } from "@/libs/core/Def"
import { Table } from "@arco-design/web-react"

type TableProps = {
  data?: any[]
  cols?: any[]
  size?: 'default'|'middle'|'small'|'mini'
}

const TableDef: UIComp.Def<TableProps> ={
  name: 'table',
  label: '表格',
  props: [
    {
      name:'data',
      label: '数据',
      valueType: 'array',
      editor: {
        type: 'textarea'
      }
    }
  ],
  render(props) {
    return <Table
    {...props.domAttrs}
      data={props.data}
      size={props.size}
      columns={props.cols}
    ></Table>
  }
}