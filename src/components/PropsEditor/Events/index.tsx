import { DesignerContext } from '@/components/Designer'
import LiveItem from '@/components/LiveItem'
import SidePane from '@/components/UIKit/SidePane'
import { IconUpCircle } from '@arco-design/web-react/icon'
import React, {useContext} from 'react'

type Props = {}

const CompEvents = (props: Props) => {
  const {bindFor, designerStore} = useContext(DesignerContext)
  return (
    <SidePane title='事件'>
      {
        designerStore.currentAgent?.def.events?.map(ev => {
          return <LiveItem title={ev.name} onClick={() => {
            bindFor?.('action', ev.name)
          }} />
        })
      }
    </SidePane>
  )
}

export default CompEvents