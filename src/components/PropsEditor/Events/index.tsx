import { DesignerContext } from '@/components/Designer'
import LiveItem from '@/components/LiveItem'
import SidePane from '@/components/SidePane'
import { IconUpCircle } from '@arco-design/web-react/icon'
import React, {useContext} from 'react'

type Props = {}

const CompEvents = (props: Props) => {
  const {openBinding} = useContext(DesignerContext)
  return (
    <SidePane title='事件'>
      <LiveItem title='点击' onClick={() => {
        openBinding?.()
      }} right={<IconUpCircle/>}/>
      <LiveItem title='更新' right={<IconUpCircle/>}/>
    </SidePane>
  )
}

export default CompEvents