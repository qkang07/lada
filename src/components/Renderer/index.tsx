import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { compMan } from '../manager'
import { CanvasContext } from '../Canvas'
import { randomId } from '@/utils'
import { BindScopeEnum, BindingSchema, CompInstanceBase, UIComp} from '../compDef'
import { DesignerContext } from '@/pages/Designer'
import { bind, cloneDeep, merge, mergeWith } from 'lodash-es'
import { observer } from 'mobx-react'
import { CompAgent } from '../CompAgent'

type Props = {
  schema: UIComp.Schema
  props?: any
}

const Renderer = observer((props: Props) => {

  const {schema} = props

  const {isDesign, compSchemaMap} = useContext(DesignerContext)

  const {canvasStore, bdCon} = useContext(CanvasContext)

  const agent = useRef<CompAgent>(new CompAgent(schema))


  const [boundProps, setBoundProps] = useState<any>({})

  const compRef = useRef<any>()

  const {compDef, CompRender} = useMemo(() => {
    const compDef = compMan.getComp(schema.provider) as UIComp.Def
    const CompRender = compDef?.render
    return {compDef, CompRender}
  }, [])


  useEffect(() => {
    bdCon.regComp(agent.current)
  }, [])

  // useEffect(() => {
  //   updateSchema()
  // }, [])

  

  if(CompRender) {
    return <>
    {
      isDesign && <span data-lada-comp-id={schema.id}></span>
    }
      <CompRender ref={compRef} slots={schema.slots} {...boundProps} />
    </>
  }
  return <span>未找到组件 {schema.provider}</span>
})

export default Renderer