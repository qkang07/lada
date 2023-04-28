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
  test: any
  onCanvasClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent> ) => void
}



const Canvas = observer((props: Props) => {

  const {schema, compTO, slotTO, onCanvasClick} = props

  const {setCurrentCompId, compSchemaMap, slotSchemaMap, eventBus, updateCompSchema} = useContext(DesignerContext)

  console.log('test update', props.test)


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
        {/* <div className={styles.theCanvas} onClick={handleCanvasClick }>
          {compsSchema.current.map((comp, i) => {
            return <Renderer schema={comp}  key={i + comp.renderer}  />
          })}
        </div> */}
        <FocusFrame  canvasDom={canvasDomRef.current || undefined} target={compTO?.dom} />
        {/* <FocusFrame canvasDom={canvasDomRef.current || undefined} target={slotTO?.doms} styles={{
          outlineColor: '#66cc88'
        }} /> */}
      </div>
    </CanvasContext.Provider>
  )
})

export default Canvas