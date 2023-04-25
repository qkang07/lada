import React, { createContext, forwardRef, useContext, useImperativeHandle, useMemo, useRef, useState } from 'react'
import styles from './index.module.less'
import { compMan } from '../manager'
import Renderer from '../Renderer'
import { ActionDef, BindScopeEnum, BindingSchema, CompRuntime, CompSchema, DataSourceInstance, SlotRuntime, SlotSchema } from '../compDef'
import { DesignerContext } from '@/pages/Designer'
import FocusFrame from '../FocusFrame'
import { Optional, randomId } from '@/utils'
import { Drawer } from '@arco-design/web-react'
import TreeView from '@/pages/Designer/TreeView'
import { makeAutoObservable } from 'mobx'


class CanvasStore {
  dataSources: DataSourceInstance[] = []
  actions: ActionDef[] = []
}

export type CanvasContextType = {
  store: CanvasStore
  processBinding: (binding: BindingSchema) => any
}

export const CanvasContext = createContext<CanvasContextType>({} as any)

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
function findSlot(dom: HTMLElement): SlotTransferObj | undefined {
  console.log(dom)
  // function findFromSibling(sib: HTMLElement): HTMLElement | undefined {
  //   if(sib.dataset?.slotName) {
  //     if(sib.dataset.slotTag === 'start') {
  //       return sib
  //     } else {
  //       return void 0
  //     }
  //   } else if(sib.previousElementSibling) {
  //     return findFromSibling(sib.previousElementSibling as HTMLElement)
  //   } 
  //   return void 0
  // }
  // function findSlotEnd(dom: HTMLElement): HTMLElement | undefined {
  //   const sib = dom.nextElementSibling as HTMLElement
  //   if(!sib) {
  //     return void 0
  //   }
  //   if(sib.dataset?.slotName && sib.dataset.slotTag === 'end') {
  //     return sib
  //   } else {
  //     return findSlotEnd(sib)
  //   }
  // }
  // let slotStart = findFromSibling(dom)
  // let slotEnd: HTMLElement | undefined
  // if(!slotStart) {
  //   if(dom.parentElement && !dom.parentElement.dataset.ladaCanvas) {
  //     slotStart = findFromSibling(dom.parentElement)
  //   }
  // }
  // if(slotStart) {
  //   slotEnd = findSlotEnd(slotStart)
  // } else {
  //   return void 0
  // }
  // let cursor: Element = slotStart!
  // const doms: Element[] = [slotStart!]

  // do{
  //   cursor = cursor.nextElementSibling!
  //   doms.push(cursor)
  // } while(cursor !== slotEnd)
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



type Props = {
  schema: CompSchema
  onCanvasClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent> ) => void
}

export type CanvasRef = {
  addComp: (name:string) => void
  getSchema: () => any
}

const Canvas = forwardRef<CanvasRef, Props>((props, ref) => {
  const {setCurrentCompId, compSchemaMap, slotSchemaMap, eventBus, updateCompSchema} = useContext(DesignerContext)

  const [renderState, setRenderState] = useState(0)

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

  useImperativeHandle(ref, () => {
    return {
      addComp(name: string) {
        const compDef = compMan.getComp(name)
        let newComp: CompRuntime = {
          renderer: name,
          name: randomId(),
          id: randomId()
        }
        if(compSchemaMap) {
          compSchemaMap[newComp.id] = newComp
        }
        if(compDef?.slots?.length) {
          newComp.slots = compDef.slots.map(s => {
            const slot: SlotRuntime = {
              name: s.name,
              comp: newComp,
              type: s.type,
              children: [],
              id: randomId()
            }
            if(slotSchemaMap) {
              slotSchemaMap[slot.id] = slot
            }
            return slot
          })
        }
        if(compDef?.createSchema) {
          newComp = compDef.createSchema(newComp) as CompRuntime
        }

        // default use root runtime schema
        console.log('newComp',newComp)
        if(slotTO) {
          slotSchemaMap?.[slotTO.id].children?.push(newComp)
          newComp.parent = compSchemaMap?.[slotTO.compId]
        } else {
          newComp.parent = runtimeSchema
          runtimeSchema.slots?.[0].children?.push(newComp)
        }
        newComp = makeAutoObservable(newComp)
        updateCompSchema?.(runtimeSchema.id, runtimeSchema)
        
        eventBus?.emit('schemaUpdate', runtimeSchema)
        
      },
      getSchema() {
        console.log(runtimeSchema)
      }
    }
  }, [slotTO])

 

  return (
    <CanvasContext.Provider value={{
      store: store.current,
      processBinding
    }}>
      <div data-lada-canvas="1" className={styles.canvasWrapper} ref={canvasDomRef}>
        <div className={styles.canvasContext}  onClick={onCanvasClick }>
          <Renderer schema={runtimeSchema} />
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