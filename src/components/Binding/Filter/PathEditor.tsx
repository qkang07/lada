import { PathFilterSchema } from '@/libs/core/Def'
import { Input } from '@arco-design/web-react'
import { IconClockCircle } from '@arco-design/web-react/icon'
import React from 'react'

type Props = {
  filter: PathFilterSchema
  onChange:(filter: PathFilterSchema) => void
}

const PathEditor = (props: Props) => {
  const {filter, onChange} = props
  const removePath = (index: number) => {
    filter.path?.splice(index, 1)
    onChange(props.filter)
  }
  const emitChange = () => {
    onChange
  }
  return (
    <div>
      {filter.path?.map((path, i) => {
        return <Input suffix={<IconClockCircle onClick={() => {
          removePath(i)
        }}/>} size='small'
          value={path}
          onChange={v => { 
            filter.path![i] = v 
          }}
        />
      })}
    </div>
  )
}

export default PathEditor