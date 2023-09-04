import { DesignerContext } from '@/components/Designer'
import LiveItem from '@/components/LiveItem'
import SidePane from '@/components/SidePane'
import { IconUpCircle } from '@arco-design/web-react/icon'
import React, {useContext} from 'react'

type Props = {}

const CompEvents = (props: Props) => {
  const {openBinding, currentCompAgent} = useContext(DesignerContext)
  return (
    <SidePane title='事件'>
      {
        currentCompAgent?.def.events?.map(ev => {
          return <LiveItem title={ev.name} onClick={() => {
            openBinding?.('action', ev.name)
          }} />
        })
      }
    </SidePane>
  )
}

export default CompEvents