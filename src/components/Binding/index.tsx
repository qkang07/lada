import { BindingSchema, BindingScopeSchema } from '@/libs/core/Def'
import React, { useContext } from 'react'
import { DesignerContext } from '../Designer'
import { CanvasContext } from '../Canvas/context'

type Props = {
  schema: BindingSchema
}

const Binding = (props: Props) => {
  const {bdCon} = useContext(CanvasContext)
  
  return (
    <div>Binding</div>
  )
}

export default Binding