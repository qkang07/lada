import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { compMan } from '../manager'
import { CanvasContext } from '../Canvas'
import { randomId } from '@/utils'
import { BindScopeEnum, BindingSchema, CompDef, CompRuntime, CompSchema } from '../compDef'
import { DesignerContext } from '@/pages/Designer'
import { bind, cloneDeep, merge, mergeWith } from 'lodash-es'
import { observer } from 'mobx-react'

type Props = {
  schema: CompRuntime
  props?: any
}

const Renderer = observer((props: Props) => {

  const {schema} = props

  const {isDesign, compSchemaMap} = useContext(DesignerContext)

  const {processBinding} = useContext(CanvasContext)


  const [boundProps, setBoundProps] = useState<any>({})
  const [rtSchema, setRTSchema] = useState(schema)

  const elRef = useRef<any>()
  const {compDef, CompRender} = useMemo(() => {
    const compDef = compMan.getComp(rtSchema.renderer) as CompDef<{}>
    const CompRender = compDef?.render
    return {compDef, CompRender}
  }, [rtSchema.renderer, elRef.current])

  const updateSchema = () => {
    processBindings()
    setRTSchema(compSchemaMap![rtSchema.id])
  }

  useEffect(() => {
    updateSchema()
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
      <CompRender slots={rtSchema.slots} {...boundProps} />
    </>
  }
  return <span>未找到组件 {rtSchema.renderer}</span>
})

export default Renderer