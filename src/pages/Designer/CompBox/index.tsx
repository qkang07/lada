import SidePane from '@/components/SidePane'
import { compMan } from '@/components/manager'
import { Button } from '@arco-design/web-react'
import React from 'react'
type Props = {
  onCompClick?: (name: string) => void
}

const CompBox = (props: Props) => {

  const names = compMan.names()
  return (
    <SidePane title='组件'>
      {
        names.map(name => {
          return <Button key={name} onClick={() => props.onCompClick?.(name)}>{name}</Button>
        })
      }
    </SidePane>
  )
}

export default CompBox