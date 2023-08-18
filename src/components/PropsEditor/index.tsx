import { DesignerContext } from '@/components/Designer'
import { Input, ResizeBox, Tabs } from '@arco-design/web-react'
import React, { useContext, useMemo, useState } from 'react'
import { pMan } from '../manager'
import StyleEditor from './StyleEditor'
import CustomPropsEditor from './CustomProps'
import EditorStack from '../EditorStack'
import BasicProps from './Basic'
import CompSlots from './Slots'
import CompEvents from './Events'
import CompActions from './Actions'

type Props = {
}

const PropsEditor = (props: Props) => {

  const {currentCompAgent} = useContext(DesignerContext)
  if(!currentCompAgent) {
    return <></>
  } 

  return (
    <div>
      <EditorStack items={[
        <BasicProps/>,
        <CustomPropsEditor/>,
        <CompSlots/>,
        <CompEvents/>,
        <CompActions/>,
        <StyleEditor/>
      ]}></EditorStack>
   
    </div>
  )
 
}

export default PropsEditor