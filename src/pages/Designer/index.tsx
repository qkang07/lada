import React, { createContext, useEffect, useMemo, useRef, useState } from 'react'
import styles from './index.module.less'
import CompBox from './CompBox'
import Canvas, { CanvasRef } from '@/components/Canvas'
import { ActionRuntime, BindingSchema, CompRuntime, CompSchema, PageSchema, SlotRuntime, SlotSchema } from '@/components/compDef'
import PropsEditor from '@/components/PropsEditor'
import FocusFrame from '@/components/FocusFrame'
import DesignerHeader from './Header'
import { ResizeBox } from '@arco-design/web-react'
import DataSources from './DataSource'
import EditorStack from '@/components/EditorStack'
import TreeView from './TreeView'
import {EventEmitter} from 'events'
import SidePane from '@/components/SidePane'
import { action, autorun, makeAutoObservable } from 'mobx'
import { randomId } from '@/utils'

export type CompTransferObj = {
  id: string
  dom: HTMLElement
  schemaRuntime: () => CompSchema
}

export type SlotTransferObj = {
  dom: HTMLElement
  id: string
  compId: string
  
}


function findComp(dom: HTMLElement): Optional<CompDomInfo> | undefined {
  let compId: string | undefined
  let compDom: HTMLElement | undefined

  const sib = dom.previousSibling as HTMLElement
  if(sib && sib.dataset?.ladaCompId) {
    compId = sib.dataset.ladaCompId
    compDom = dom
    return {
      compId,
      compDom
    }
  } else if( dom.parentElement && !dom.parentElement.dataset.ladaCanvas) {
    return findComp(dom.parentElement)
  }
  return void 0
  
}

//  这个可以优化
function findSlot(dom: HTMLElement): SlotTransferObj | undefined {
  console.log(dom)

  if(dom.dataset.ladaCanvas) {
    return undefined
  }

  if(dom.dataset.slotId) {
    return {
      id: dom.dataset.slotId!,
      compId: dom.dataset.slotCompId!,
      dom
    }
  } else return findSlot(dom.parentElement!)

}


type DesignerContextType = {

  eventBus?: EventEmitter
  isDesign?: boolean
  currentCompId?: any
  actions?: ActionRuntime[]
  setCurrentCompId?: (id?: any) => void
  currentCompSchema?: () => CompRuntime | void
  compSchemaMap?: Record<any, CompRuntime>
  slotSchemaMap?: Record<any, SlotRuntime>
  updateCompSchema?: (id: any, schema: CompRuntime) => any
  updateCompBinding?: (id: any, binding: BindingSchema) => void
  deleteComp?: (id: any) => any
}


export const DesignerContext = createContext<DesignerContextType>({} as any)

type Props = {}

const Designer = (props: Props) => {

  const [renderState, setRenderState] = useState(0)
  const [currentCompId, setCurrentCompId] = useState()

  const canvasRef = useRef<CanvasRef>(null)

  const handleCompAdd = (name: string) => {
    canvasRef.current?.addComp(name)
  }

  const compSchemaMapRef = useRef<Record<any, CompRuntime>>(makeAutoObservable({}))
  const slotSchemaMapRef = useRef<Record<any, SlotRuntime>>({})
  const eventBusRef = useRef(new EventEmitter)


  const compSchemaMap = compSchemaMapRef.current
  const slotSchemaMap = slotSchemaMapRef.current
  const eventBus = eventBusRef.current

  const pageSchema = useRef<PageSchema>({
    name: 'test page',
    rootComp: {
      renderer: 'listLayout',
    name: 'root',
    slots: [{
      name: 'default',
      type: 'list',
      children: []
    }],
    
    },
    dataSources: []
  })


  const [compTO, setCompTO] = useState<CompTransferObj>()
  const [slotTO, setSlotTO] = useState<SlotTransferObj>()

  const runtimeSchema = useMemo(() => {
    const makeRuntimeSlot = (slot: SlotSchema, comp: CompRuntime) => {
      const runtime: SlotRuntime = makeAutoObservable({
        ...slot,
        children: slot.children?.map(c => makeRuntimeComp(c, comp)),
        comp,
        id: randomId()
      })
      if(slotSchemaMap) {
        slotSchemaMap[runtime.id] = runtime
      }
      return runtime
    }
    const makeRuntimeComp = (comp: CompSchema, parent?: CompRuntime) => {
      const runtime:CompRuntime = makeAutoObservable({
        ...comp,
        slots: [],
        parent,
        id: randomId()
      })
      runtime.slots = comp.slots?.map(s => makeRuntimeSlot(s, runtime))
      if(compSchemaMap) {
        compSchemaMap[runtime.id] = runtime
      }
      return runtime
    }
    return makeRuntimeComp(props.schema)
  }, [props.schema])



  const updateCompSchema = action((id: any, schema: CompRuntime) => {
    if(compSchemaMap[id]) {
      compSchemaMap[id] = schema
    }
    eventBus.emit('schemaUpdate', )
  })

  const updateCompBinding = action((id: any, binding: BindingSchema) => {
    const compSchema = compSchemaMap[id]
    if(!compSchema) {
      console.warn('No comp schema found:', id)
      return
    }
    let cBinding = compSchema.bindings?.find(b => b.prop === binding.prop)
    if(!cBinding) {
      cBinding = binding
      compSchema.bindings?.push(cBinding)
    } else {
      cBinding.binding = binding.prop
      cBinding.scope = binding.scope
    }
  })

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent> ) => {
    const source = e.nativeEvent.target as HTMLElement
    const theComp = findComp(source)
    
    if(theComp?.compId) {
      setCurrentCompId?.(theComp.compId)
      setCompTO({
        id: theComp.compId,
        dom: theComp.compDom!,
        schemaRuntime: () => compSchemaMap![theComp.compId!],
      })
    }

    const theSlot = findSlot(source)
    if(theSlot?.id) {
      setSlotTO(theSlot)
    }
    
  }



  const currentCompSchema = () => {
    if(currentCompId) {
      return compSchemaMap[currentCompId]
    }
    return void 0
  }

  const deleteComp =action((id: any) => {
    delete compSchemaMap[id]
  })


  return (
    <DesignerContext.Provider value={{
      isDesign: true,
      currentCompId,
      setCurrentCompId,
      compSchemaMap,
      updateCompSchema,
      updateCompBinding,
      currentCompSchema,
      slotSchemaMap,
      deleteComp,
      eventBus
    }}>

      <div className={styles.designer}>
        <div className={styles.head}>
          <DesignerHeader onSave={() => {
            canvasRef.current?.getSchema()
          }}/>
        </div>
        <div className={styles.body}>
          <div className={styles.toolbox}>
            <EditorStack 
              items={[
                <CompBox onCompClick={handleCompAdd}/>,
                <DataSources schemas={pageSchema.current.dataSources} onAdd={ds => {
                  pageSchema.current.dataSources.push(ds)
                  setRenderState(Math.random())
                }}/>,
                <TreeView/>
              ]}
            />
        
          </div>
          <div className={styles.canvas}>
            <Canvas schema={pageSchema.current.rootComp} ref={canvasRef} />
          </div>
          <div className={styles.editor}>
            <PropsEditor compId={currentCompId}/>
          </div>
        </div>
        
      </div>
    </DesignerContext.Provider>
  )
}

export default Designer