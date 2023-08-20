import React, { createContext, useEffect, useMemo, useRef, useState } from 'react'
import styles from './index.module.less'
import CompBox from './CompBox'
import Canvas, { CanvasRef } from '@/components/Canvas'
import { BindingScopeSchema, CompInstanceBase, CompSchemaBase, UIComp } from '@/libs/core/Def'
import PropsEditor from '@/components/PropsEditor'
import FocusFrame from '@/components/FocusFrame'
import DesignerHeader from './Header'
import { ResizeBox } from '@arco-design/web-react'
import DataSources from './DataSource'
import EditorStack from '@/components/EditorStack'
import TreeView from './TreeView'
import {EventEmitter} from 'events'
import SidePane from '@/components/SidePane'
import { action, autorun, makeAutoObservable, observable } from 'mobx'
import { Optional, randomId } from '@/utils'
import { useParams } from 'react-router-dom'
import { useRequest } from 'ahooks'
import { pMan } from '@/components/manager'
import { BindingContainer } from '@/libs/core/BindingContainer'
import { CompAgent } from '@/libs/core/CompAgent'



type CompDomInfo = {
  id: string
  dom: HTMLElement
}

export interface CompInfo extends CompDomInfo {
  agent: CompAgent<UIComp.Schema>
}


export type SlotInfo = {
  dom: HTMLElement
  // id: string
  name: string
  compDomInfo: CompDomInfo
  compAgent: CompAgent<UIComp.Schema>
  
}


function findComp(dom: HTMLElement): CompDomInfo | undefined {

  const sib = dom.previousSibling as HTMLElement
  if(sib && sib.dataset?.ladaCompId) {
    const id = sib.dataset.ladaCompId
    return {
      id,
      dom
    }
  } else if( dom.parentElement && !dom.parentElement.dataset.ladaCanvas) {
    return findComp(dom.parentElement)
  }
  return void 0
  
}

//  这个可以优化
function findSlot(dom: HTMLElement): {compDomInfo: CompDomInfo, name: string, dom: HTMLElement} | undefined {

  if(dom.dataset.ladaCanvas) {
    return undefined
  }

  if(dom.dataset.slotName) {
    const compDomInfo = findComp(dom)!
    return {
      compDomInfo,
      name: dom.dataset.slotName!,
      dom
    }
  } else if(dom.parentElement) return findSlot(dom.parentElement)
  return undefined
}


// const defaultPageSchema = ():  => ({
//   name: 'New Page',
//   rootComp: {
//     provider: 'listLayout',
//     name: 'root',
//     slots: [{
//       name: 'default',
//       type: 'list',
//       children: []
//     }],
//   },
//   dataSources: []
// })





type DesignerContextType = {

  eventBus?: EventEmitter
  isDesign?: boolean
  bdContainer?: BindingContainer
  currentCompAgent?: CompAgent<UIComp.Schema>
  deleteComp?: (id: any) => any
}


export const DesignerContext = createContext<DesignerContextType>({} as any)

type Props = {
  bdConSchema?: BindingScopeSchema
}

const Designer = (props: Props) => {

  const {bdConSchema} = props

  const eventBusRef = useRef(new EventEmitter)
  const canvasRef = useRef<CanvasRef | null>(null)
  const canvasContainerRef = useRef<HTMLDivElement>(null)

  const bdContainer = canvasRef.current?.container

  const currentCompInfoRef = observable(useRef<CompInfo>())
  const currentCompInfo = currentCompInfoRef.current

  const currentSlotInfoRef = observable(useRef<SlotInfo>())
  const currentSlotInfo = currentSlotInfoRef.current

  const eventBus = eventBusRef.current

  const obsSchemaRef = useRef<BindingScopeSchema>()

  const obsSchema = obsSchemaRef.current

  useEffect(() => {
    if(bdConSchema){

      obsSchemaRef.current = observable(bdConSchema)
    }
  }, [bdConSchema])


  const handleCompAdd = (name: string) => {
    addComp(name)
  }


  const addComp = action((provider: string) => {
    const compDef = pMan.getComp(provider)
    const id = randomId()
    let schema: UIComp.Schema = {
      provider,
      name: name + id,      
      id
    }

   
    if(compDef?.createSchema) {
      schema = compDef.createSchema(schema)
    }
    
    if(currentSlotInfo) {
      const slotSchema = currentSlotInfo.compAgent.schema.slots?.find(s => s.name === currentSlotInfo.name)
      slotSchema?.children?.push(schema)
      // currentCompInfo?.agent.schema.slots?.find(s => s.name === currentSlotInfo.id)
    } else {
      obsSchema?.uiRoot?.slots?.[0].children?.push(schema)
      // newComp.parent = runtimeSchema
      // runtimeSchema.slots?.[0].children?.push(newComp)
    }
    eventBus.emit('schemaUpdate')
  })

  const handleCanvasClick =  action((e: React.MouseEvent<HTMLDivElement, MouseEvent> ) => {
    const source = e.nativeEvent.target as HTMLElement
    const compDomInfo = findComp(source)
    
    if(compDomInfo?.id) {
      const agent =  bdContainer?.compMap.get(compDomInfo.id)!
      currentCompInfoRef.current = {
        id: compDomInfo.id,
        dom: compDomInfo.dom,
        agent
      }
    }

    const theSlot = findSlot(source)
    console.log('found slot', theSlot)
    if(theSlot?.name) {
      const agent = bdContainer?.compMap.get(theSlot.compDomInfo.id)
      currentSlotInfoRef.current = {
        name: theSlot.name,
        dom: theSlot.dom,
        compDomInfo: theSlot.compDomInfo,
        compAgent: agent!
      }
    }
    
  })


  const deleteComp = action((id: string) => {
  })


  return (
    <DesignerContext.Provider value={{
      isDesign: true,
      deleteComp,
      eventBus,
      bdContainer: canvasRef.current?.container,
      currentCompAgent: currentCompInfo?.agent
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
                // <DataSources schemas={pageSchema.dataSources} onAdd={ds => {
                //   pageSchema.dataSources.push(ds)
                // }}/>,
                <TreeView schema={obsSchema?.uiRoot!}/>
              ]}
            />
        
          </div>
          <div className={styles.canvas} ref={canvasContainerRef}>
            <Canvas ref={canvasRef} onCanvasClick={handleCanvasClick} initSchema={obsSchema!} />
            <FocusFrame containerDom={canvasContainerRef.current as HTMLElement} target={currentCompInfo?.dom} />

          </div>
          <div className={styles.editor}>
            <PropsEditor />
          </div>
        </div>
        
      </div>
    </DesignerContext.Provider>
  )
}

export default Designer