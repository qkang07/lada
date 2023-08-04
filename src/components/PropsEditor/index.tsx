import { DesignerContext } from '@/pages/Designer'
import { Input, ResizeBox, Tabs } from '@arco-design/web-react'
import React, { useContext, useMemo, useState } from 'react'
import { compMan } from '../manager'
import { BindScopeEnum, BindingSchema } from '../../libs/core/Def'
import StyleEditor from './StyleEditor'
import CustomPropsEditor from './CustomProps'
import EditorStack from '../EditorStack'
import BasicProps from './Basic'
import CompSlots from './Slots'
import CompEvents from './Events'
import CompActions from './Actions'

type Props = {
  compId?: string
}

const PropsEditor = (props: Props) => {
  const {compId} = props


  console.log('comp id',compId)


  if(!compId) {
    return <></>
  } 

 

  return (
    <div>
      <EditorStack items={[
        <BasicProps compId={compId}/>,
        <CustomPropsEditor compId={compId}/>,
        <CompSlots/>,
        <CompEvents/>,
        <CompActions/>,
        <StyleEditor compId={compId}/>
      ]}></EditorStack>
   
    </div>
  )
 
}

export default PropsEditor