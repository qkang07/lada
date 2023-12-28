import { DataFilterSchema, DataFilterType } from '@/libs/core/Def'
import { Button } from '@arco-design/web-react'
import { IconFilter } from '@arco-design/web-react/icon'
import React from 'react'

const FilterNameMap: Record<DataFilterType, string> = {
  child: '子属性',
  arrayMap: '数组',
  format: '格式',
  objMap: '映射',
  custom: '自定义'
}

type Props = {
  filter: DataFilterSchema
  onClick?: () => void
}

const FilterButton = (props: Props) => {
  return (
    <Button type='dashed' shape='square' icon={<IconFilter/>}
      onClick={() => {
        props.onClick?.()
      }}
    >{
      FilterNameMap[props.filter.type]
    }</Button>
  )
}

export default FilterButton