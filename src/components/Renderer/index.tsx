import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { compMan } from '../manager'
import { CanvasContext } from '../Canvas'
import { randomId } from '@/utils'
import { CompInstanceBase, UIComp} from '../../libs/core/Def'
import { DesignerContext } from '@/pages/Designer'
import { bind, cloneDeep, merge, mergeWith } from 'lodash-es'
import { observer } from 'mobx-react'
import { CompAgent } from '../../libs/core/CompAgent'

type Props = {
  schema: UIComp.Schema
  props?: any
}

const Renderer = observer((props: Props) => {

  const {schema} = props

  const {isDesign} = useContext(DesignerContext)

  const {bdCon} = useContext(CanvasContext)

  const agent = useRef<CompAgent<UIComp.Schema, UIComp.Def>>(new CompAgent(schema))

  const CompRender = agent.current.def.render

  useEffect(() => {
    bdCon.regComp(agent.current)
  }, [])

  const renderProps: UIComp.RenderProps = {
    agent: agent.current,
    // TODO: 这里要初始化 props
  }
  
  if(CompRender) {
    return <>
    {
      isDesign && <span data-lada-comp-id={schema.id}></span>
    }
      <CompRender slots={schema.slots} {...renderProps} />
    </>
  }
  return <span>未找到组件 {schema.provider}</span>
})

export default Renderer