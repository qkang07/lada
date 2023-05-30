import React, { createContext, forwardRef, useContext, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import styles from './index.module.less'
import Renderer from '../Renderer'
import { ActionDef, BindScopeEnum, BindingSchema, DataSource, UIComp} from '../compDef'
import { CompTransferObj, DesignerContext, SlotTransferObj } from '@/pages/Designer'
import FocusFrame from '../FocusFrame'
import { Optional, randomId } from '@/utils'
import { Drawer } from '@arco-design/web-react'
import TreeView from '@/pages/Designer/TreeView'
import { action, autorun, makeAutoObservable } from 'mobx'
import { observer } from 'mobx-react'



export class CanvasStore {
  dataSources: DataSource.Instance[] = []


  uiCompMap: Map<string, UIComp.Instance> = new Map()
  dsMap: Map<string, DataSource.Instance> = new Map()

  regDS(ds: DataSource.Instance) {
    this.dsMap.set(ds.id, ds)
  }

  unRegDS(ds: DataSource.Instance) {
    this.dsMap.delete(ds.id)
  }

  regUIComp(comp: UIComp.Instance) {
    this.uiCompMap.set(comp.id, comp)
  }

  unRegUIComp(comp: UIComp.Instance) {
    this.uiCompMap.delete(comp.id)
  }



}

export type CanvasContextType = {
  canvasStore: CanvasStore
  processBinding: (binding: BindingSchema) => any
}

export const CanvasContext = createContext<CanvasContextType>({} as any)


type Props = {
  schema: UIComp.Schema
  compTO?: CompTransferObj
  slotTO?: SlotTransferObj
  onCanvasClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent> ) => void
}

export type CanvasRef = {
  store: CanvasStore
}


const Canvas = observer(forwardRef<CanvasRef, Props>((props, ref) => {

  const {schema, compTO, slotTO, onCanvasClick} = props

  const {compSchemaMap, slotSchemaMap, eventBus} = useContext(DesignerContext)


  const store = useRef<CanvasStore>(makeAutoObservable(new CanvasStore()))
  const canvasDomRef = useRef<HTMLDivElement>(null)

  useImperativeHandle(ref, () => {
    return {
      store: store.current
    }
  }, [])

  const regDataSource = action((type: string, ) => {
    
  })

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
      canvasStore: store.current,
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
}))

export default Canvas