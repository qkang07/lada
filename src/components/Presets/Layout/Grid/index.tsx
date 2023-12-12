import SlotHolder from "@/components/SlotHolder"
import { UIComp } from "@/libs/core/Def"

type GridLayoutType = {
  gap: number
  colNum: number
  rowNum: number
}


const GridLayoutDef: UIComp.Def<GridLayoutType> = {
  name: 'gridLayout',
  label: '表格布局',
  props: [
    {
      name: 'gap',
      valueType: 'number',
      defaultValue: 0,
    },
    {
      name: 'colNum',
      valueType: 'number',
      defaultValue: 3
    },{
      name: 'rowNum',
      valueType: 'number',
      defaultValue: 3
    }

  ],
  render(props) {
    const {} = props

    return <div {...props.domAttrs}>
      <SlotHolder/>
    </div>
  }
}
