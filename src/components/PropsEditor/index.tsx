import { DesignerContext } from '@/components/Designer'
import { Input, ResizeBox, Tabs } from '@arco-design/web-react'
import React, { useContext, useMemo, useState } from 'react'
import StyleEditor from './StyleEditor'
import CustomPropsEditor from './CustomProps'
import BasicProps from './Basic'
import CompSlots from './Slots'
import CompEvents from './Events'
import CompActions from './Actions'
import { observer } from 'mobx-react'

type Props = {
}

const PropsEditor = observer((props: Props) => {

  const {designerStore} = useContext(DesignerContext)
  if(!designerStore.currentAgent) {
    return <></>
  } 

  return (
    <div>
      <BasicProps/>
      <CustomPropsEditor/>
      <CompSlots/>
      <CompEvents/>
      <CompActions/>
      <StyleEditor/>
      {/* <EditorStack items={[
      ]}></EditorStack> */}
   
    </div>
  )
 
})

export default PropsEditor