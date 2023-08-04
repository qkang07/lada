import React, { createContext, forwardRef, useContext, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import styles from './index.module.less'
import Renderer from '../Renderer'
import { ActionDef, CompSchemaBase, DataSource, BindingScope, SchemaBase, UIComp} from '../../libs/core/Def'
import { CompTransferObj, DesignerContext, SlotTransferObj } from '@/pages/Designer'
import FocusFrame from '../FocusFrame'
import { Optional, randomId } from '@/utils'
import { Drawer } from '@arco-design/web-react'
import TreeView from '@/pages/Designer/TreeView'
import { action, autorun, makeAutoObservable } from 'mobx'
import { observer } from 'mobx-react'
import { isEqual } from 'lodash-es'
import { compMan } from '../manager'
import { BindingContainer } from '../../libs/core/BindingContainer'
import { CompAgent } from '../../libs/core/CompAgent'



// export class CanvasStore {


  

//   dataSources: DataSource.Instance[] = []


//   uiCompMap: Map<string, UIComp.Instance> = new Map()
//   dsMap: Map<string, DataSource.Instance> = new Map()

//   bindingList: Page.BindingSchema[] = []

//   // bindingMap: Map<string, Page.BindingSchema> = new Map()

//   regDS(ds: DataSource.Instance) {
//     this.dsMap.set(ds.id, ds)
//   }

//   unRegDS(ds: DataSource.Instance) {
//     this.dsMap.delete(ds.id)
//   }

//   regUIComp(comp: UIComp.Instance) {
//     this.uiCompMap.set(comp.id, comp)
//   }

//   unRegUIComp(comp: UIComp.Instance) {
//     this.uiCompMap.delete(comp.id)
//   }

//   hasBinding(binding: Page.BindingSchema) {
//     const res = this.bindingList.find(bd => isEqual(bd, binding))
//     return res
//   }

//   regBinding(binding: Page.BindingSchema ) {
//     if(!this.hasBinding(binding)) {
//       this.bindingList.push(binding)
//     }
//   }
//   unRegBinding(binding: Page.BindingSchema) {
//     const bd = this.hasBinding(binding)
//     if(bd) {
//       this.bindingList.splice(this.bindingList.indexOf(bd), 1)
//     }
//   }

//   // really important
//   createComp(schema: CompSchemaBase) {
//     const def = compMan.getComp(schema.provider)
//     if(!def) {
//       console.warn('schema provider not fount: ', schema.provider)
//       return
//     }

//   }



// }

export type CanvasContextType = {
  bdCon: BindingContainer
  // processBinding: (binding: BindingSchema) => any
}

export const CanvasContext = createContext<CanvasContextType>({} as any)


type Props = {
  initSchema: BindingScope.Schema
  compTO?: CompTransferObj
  slotTO?: SlotTransferObj
  onCanvasClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent> ) => void
}

export type CanvasRef = {
  // store: CanvasStore
  comps: Map<string, CompAgent>
  container: BindingContainer
}


const Canvas = observer(forwardRef<CanvasRef, Props>((props, ref) => {

  const {initSchema, compTO, slotTO, onCanvasClick} = props

  const {compSchemaMap, slotSchemaMap, eventBus} = useContext(DesignerContext)

  const [schema, setSchema] = useState<UIComp.Schema>(initSchema.uiRoot)


  // const store = useRef<CanvasStore>(makeAutoObservable(new CanvasStore()))


  // const schemaCompMap = useRef(new Map<string, CompSchemaBase>())

  const canvasDomRef = useRef<HTMLDivElement>(null)

  const bindingContainer = useRef(new BindingContainer(compMan, initSchema))

  useImperativeHandle(ref, () => {
    return {
      // store: store.current,
      comps: bindingContainer.current.compMap,
      container: bindingContainer.current
    }
  }, [])


  // const processBinding = (binding: BindingSchema) => {
  //   if(binding.scope === BindScopeEnum.Direct) {
  //     return binding.binding
  //   } else if(binding.scope === BindScopeEnum.Props) {
  //     // TODO 
  //     return void 0
  //   } else if(binding.scope === BindScopeEnum.Page) {
  //     return store.current.dataSources.find(d => d.schema.name === binding.binding)?.value    }
  //     //TODO
  //   return void 0
  // }


  return (
    <CanvasContext.Provider value={{
      bdCon: bindingContainer.current,
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