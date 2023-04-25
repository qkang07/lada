import LiveItem from '@/components/LiveItem'
import SidePane from '@/components/SidePane'
import { IconUpCircle } from '@arco-design/web-react/icon'
import React from 'react'

type Props = {}

const CompEvents = (props: Props) => {
  return (
    <SidePane title='事件'>
      <LiveItem title='点击' right={<IconUpCircle/>}/>
      <LiveItem title='更新' right={<IconUpCircle/>}/>
    </SidePane>
  )
}

export default CompEvents