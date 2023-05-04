import React, { createContext, forwardRef, useContext, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import styles from './index.module.less'
import { compMan } from '../manager'
import Renderer from '../Renderer'
import { ActionDef, BindScopeEnum, BindingSchema, CompRuntime, CompSchema, DataSourceInstance, SlotRuntime, SlotSchema } from '../compDef'
import { CompTransferObj, DesignerContext, SlotTransferObj } from '@/pages/Designer'
import FocusFrame from '../FocusFrame'
import { Optional, randomId } from '@/utils'
import { Drawer } from '@arco-design/web-react'
import TreeView from '@/pages/Designer/TreeView'
import { autorun, makeAutoObservable } from 'mobx'
import { observer } from 'mobx-react'


class CanvasStore {
  dataSources: DataSourceInstance[] = []
  actions: ActionDef[] = []
}

export type CanvasContextType = {
  store: CanvasStore
  processBinding: (binding: BindingSchema) => any
}

export const CanvasContext = createContext<CanvasContextType>({} as any)


type Props = {
  schema: CompRuntime
  compTO?: CompTransferObj
  slotTO?: SlotTransferObj
  onCanvasClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent> ) => void
}


const Canvas = observer((props: Props) => {

  const {schema, compTO, slotTO, onCanvasClick} = props

  const {compSchemaMap, slotSchemaMap, eventBus} = useContext(DesignerContext)


  const store = useRef<CanvasStore>(new CanvasStore())
  const canvasDomRef = useRef<HTMLDivElement>(null)


  const processBinding = (binding: BindingSchema) => {
    if(binding.scope === BindScopeEnum.Direct) {
      return binding.binding
    } else if(binding.scope === BindScopeEnum.Props) {
      // TODO 
      return void 0
    } else if(binding.scope === BindScopeEnum.Page) {
      return store.current.dataSources.find(d => d.schema.name === binding.binding)?.value    }
      //TODO
    return void 0
  }


  return (
    <CanvasContext.Provider value={{
      store: store.current,
      processBinding
    }}>
      <div data-lada-canvas="1" className={styles.canvasWrapper} ref={canvasDomRef}>
        <div className={styles.canvasContext}  onClick={onCanvasClick }>
          <Renderer schema={schema} />
        </div>
        <FocusFrame  canvasDom={canvasDomRef.current || undefined} target={compTO?.dom} />
      </div>
    </CanvasContext.Provider>
  )
})

export default Canvas