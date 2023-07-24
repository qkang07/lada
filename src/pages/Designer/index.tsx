import React, { createContext, useEffect, useMemo, useRef, useState } from 'react'
import styles from './index.module.less'
import CompBox from './CompBox'
import Canvas, { CanvasRef } from '@/components/Canvas'
import { CompInstanceBase, CompSchemaBase } from '@/components/compDef'
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
import { Optional, randomId } from '@/utils'
import { useParams } from 'react-router-dom'
import { useRequest } from 'ahooks'
import { uiMan } from '@/components/manager'
import { BindingContainer } from '@/components/BindingContainer'

export type CompTransferObj = {
  id: string
  dom: HTMLElement
  schemaRuntime: CompSchema
}

export type SlotTransferObj = {
  dom: HTMLElement
  id: string
  compId: string
  runtime: SlotRuntime
  
}
type CompDomInfo = {
  compId: string
  compDom: HTMLElement
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
function findSlot(dom: HTMLElement): {id: string, compId: string, dom: HTMLElement} | undefined {

  if(dom.dataset.ladaCanvas) {
    return undefined
  }

  if(dom.dataset.slotId) {
    return {
      id: dom.dataset.slotId!,
      compId: dom.dataset.slotCompId!,
      dom
    }
  } else if(dom.parentElement) return findSlot(dom.parentElement)
  return undefined
}


const defaultPageSchema = ():PageSchema => ({
  name: 'New Page',
  rootComp: {
    provider: 'listLayout',
    name: 'root',
    slots: [{
      name: 'default',
      type: 'list',
      children: []
    }],
  },
  dataSources: []
})





type DesignerContextType = {

  eventBus?: EventEmitter
  isDesign?: boolean
  bdContainer?: BindingContainer
  actions?: ActionRuntime[]
  compSchemaMap?: Record<any, CompRuntime>
  slotSchemaMap?: Record<any, SlotRuntime>
  updateCompSchema?: (id: any, schema: CompRuntime) => any
  updateCompBinding?: (id: any, binding: BindingSchema) => void
  deleteComp?: (id: any) => any

}


export const DesignerContext = createContext<DesignerContextType>({} as any)

type Props = {}

const Designer = (props: Props) => {

  const {id} = useParams<{id:string}>()
  const compSchemaMapRef = useRef<Record<any, CompRuntime>>(makeAutoObservable({}))
  const slotSchemaMapRef = useRef<Record<any, SlotRuntime>>({})
  const eventBusRef = useRef(new EventEmitter)
  const canvasRef = useRef<CanvasRef | null>(null)


  const compSchemaMap = compSchemaMapRef.current
  const slotSchemaMap = slotSchemaMapRef.current
  const eventBus = eventBusRef.current

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

  const [pageSchema] = useState(defaultPageSchema())

  const [runtimeSchema] = useState(makeRuntimeComp(pageSchema.rootComp))


  const handleCompAdd = (name: string) => {
    addComp(name)
  }




  // const {data: pageSchema = defaultPageSchema()} = useRequest<PageSchema, void[]>(() => {
  //   if(id) {
  //     //  TODO fetch page schema
  //     return Promise.resolve(defaultPageSchema())
  //   } else return Promise.resolve(defaultPageSchema())
  // }, {refreshDeps:[id]})



  const [compTO, setCompTO] = useState<CompTransferObj>()
  const [slotTO, setSlotTO] = useState<SlotTransferObj>()


  const addComp = action((name: string) => {
    const compDef = uiMan.getComp(name)
    const schema: CompSchemaBase = {
      provider: name,
      name: name + randomId()
    }
    let newComp: CompInstanceBase = {
      schema,
      def: compDef,
      id: randomId()
    }
    compSchemaMap[newComp.id] = newComp
    if(compDef?.slots?.length) {
      newComp.slots = compDef.slots.map(s => {
        const slot: SlotRuntime = makeAutoObservable({
          name: s.name,
          comp: newComp,
          type: s.type,
          children: [],
          id: randomId()
        })
        if(slotSchemaMap) {
          slotSchemaMap[slot.id] = slot
        }
        return slot
      })
    }
    if(compDef?.createSchema) {
      newComp = compDef.createSchema(newComp) as CompRuntime
    }

    console.log('newComp',newComp)
    newComp = makeAutoObservable(newComp)
    
    // default use root runtime schema
    if(slotTO) {
      
      slotSchemaMap?.[slotTO.id].children?.push(newComp)
      newComp.parent = compSchemaMap?.[slotTO.compId]
    } else {
      newComp.parent = runtimeSchema
      runtimeSchema.slots?.[0].children?.push(newComp)
    }
    eventBus.emit('schemaUpdate')
  })


  const updateCompSchema = action((id: any, schema: CompRuntime) => {
    if(compSchemaMap[id]) {
      compSchemaMap[id] = schema
    }
    eventBus.emit('schemaUpdate', schema)
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
      setCompTO({
        id: theComp.compId,
        dom: theComp.compDom!,
        schemaRuntime: compSchemaMap[theComp.compId!],
      })
    }

    const theSlot = findSlot(source)
    console.log('found slot', theSlot)
    if(theSlot?.id) {
      setSlotTO({
        ...theSlot,
        runtime: slotSchemaMap[theSlot.id]
      })
    }
    
  }


  const deleteComp =action((id: any) => {
    delete compSchemaMap[id]
  })


  return (
    <DesignerContext.Provider value={{
      isDesign: true,
      compSchemaMap,
      updateCompSchema,
      updateCompBinding,
      slotSchemaMap,
      deleteComp,
      eventBus,
      bdContainer: canvasRef.current?.container
    }}>

      <div className={styles.designer}>
        <div className={styles.head}>
          <DesignerHeader onSave={() => {
          }}/>
        </div>
        <div className={styles.body}>
          <div className={styles.toolbox}>
            <EditorStack 
              items={[
                <CompBox onCompClick={handleCompAdd}/>,
                <DataSources schemas={pageSchema.dataSources} onAdd={ds => {
                  pageSchema.dataSources.push(ds)
                }}/>,
                <TreeView schema={runtimeSchema}/>
              ]}
            />
        
          </div>
          <div className={styles.canvas}>
            <Canvas ref={canvasRef} onCanvasClick={handleCanvasClick} compTO={compTO} slotTO={slotTO} schema={runtimeSchema} />
          </div>
          <div className={styles.editor}>
            <PropsEditor compId={compTO?.id}/>
          </div>
        </div>
        
      </div>
    </DesignerContext.Provider>
  )
}

export default Designer