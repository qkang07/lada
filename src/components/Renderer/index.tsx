import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { uiMan } from '../manager'
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
  const [rtSchema, setRTSchema] = useState(schema)

  const compRef = useRef<any>()

  const instanceRef = useRef<CompInstanceBase>()
  const {compDef, CompRender} = useMemo(() => {
    const compDef = uiMan.getComp(rtSchema.provider) 
    const CompRender = compDef?.render
    return {compDef, CompRender}
  }, [rtSchema.provider])

  const updateSchema = () => {
    processBindings()
    setRTSchema(compSchemaMap![rtSchema.id])
  }



  useEffect(() => {
    updateSchema()
    // TODO  需要能 update schema
    bdCon.regComp(agent.current)
    
  }, [schema])

  // useEffect(() => {
  //   updateSchema()
  // }, [])

  
  const updateBinding = (binding: BindingSchema) => {
    let cBinding = rtSchema.bindings?.find(b => b.prop === binding.prop)
    if(!cBinding) {
      cBinding = binding
      rtSchema.bindings?.push(cBinding)
    } else {
      cBinding.binding = binding.prop
      cBinding.scope = binding.scope
    }
    updateSchema()
  }

  const processBindings = () => {
    const compProps: any = {
      ...props.props
    }
    rtSchema.bindings?.forEach(binding => {
      compProps[binding.prop] = processBinding(binding)
    })
    setBoundProps(compProps)
  }

  if(CompRender) {
    return <>
    {
      isDesign && <span data-lada-comp-id={rtSchema.id}></span>
    }
      <CompRender ref={compRef} slots={rtSchema.slots} {...boundProps} />
    </>
  }
  return <span>未找到组件 {rtSchema.provider}</span>
})

export default Renderer