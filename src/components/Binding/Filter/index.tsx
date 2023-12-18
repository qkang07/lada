import { DataFilterSchema, DataFilterType } from '@/libs/core/Def'
import { Button, Popover } from '@arco-design/web-react'
import { IconFilter } from '@arco-design/web-react/icon'
import React from 'react'

type Props = {
  filter: DataFilterSchema
}

const FilterNameMap: Record<DataFilterType, string> = {
  child: '子属性',
  arrayMap: '数组',
  format: '格式',
  objMap: '映射',
  custom: '自定义'
}

const BindingFilter = (props: Props) => {

  return (
    <div>
      <Popover content={
        <div></div>
      }>
        <Button type='dashed' shape='square' icon={<IconFilter/>}>{FilterNameMap[props.filter.type]}</Button>
      </Popover>
    </div>
  )
}

export default BindingFilter