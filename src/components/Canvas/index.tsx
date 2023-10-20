import React, { createContext, forwardRef, useCallback, useContext, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import styles from './index.module.less'
import Renderer from '../Renderer'
import {  CompSchemaBase, SchemaBase, UIComp, BindingScopeSchema} from '../../libs/core/Def'
import {  DesignerContext } from '../Designer'
import FocusFrame from '../FocusFrame'
import { Optional, randomId } from '@/utils'
import { Drawer } from '@arco-design/web-react'
import { isEqual } from 'lodash-es'
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
  bdCon?: BindingContainer
  // processBinding: (binding: BindingSchema) => any
}

export const CanvasContext = createContext<CanvasContextType>({} as any)


type Props = {
  initSchema?: BindingScopeSchema
  onCanvasClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent> ) => void
  onCompSelect?: () => void
}

export type CanvasRef = {
  bdCon?: BindingContainer
  initPureComp?: (schema: CompSchemaBase) => CompAgent
}


const Canvas = forwardRef<CanvasRef, Props>((props, ref) => {

  const {initSchema, onCanvasClick} = props

  const {isDesign} = useContext(DesignerContext)


  const canvasDomRef = useRef<HTMLDivElement>(null)



  let [bdCon, setBdCon] = useState<BindingContainer | undefined>(() => {
    return initSchema ? new BindingContainer(initSchema) : undefined
  })

  // 实例化非 UI 组件
  const initPureComp = useCallback((schema: CompSchemaBase) => {
    const agent = new CompAgent(schema, bdCon)
    return agent
  },[])

  useImperativeHandle(ref, () => {
    return {
      bdCon,
      initPureComp
    }
  }, [bdCon])

  

  useEffect(() => {
    console.log('init schema', initSchema)
    if(initSchema) {
      if(!bdCon) {
        bdCon = new BindingContainer(initSchema)
        setBdCon(bdCon)
      }
      if(isDesign) {
        // 设计模式 datasource 由 
      } else {
        initSchema.dataSources.forEach(ds => {
          initPureComp(ds)
        })
      }
      initSchema.pureComps.forEach(c => {
        initPureComp(c)
      })
    }
  }, [initSchema])


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

console.log('canvas render')
  return (
    <CanvasContext.Provider value={{
      bdCon,
    }}>
      <div data-lada-canvas="1" className={styles.canvasWrapper} ref={canvasDomRef}>
        {
          initSchema && <div className={styles.canvasContext}  onClick={onCanvasClick }>
            <Renderer schema={initSchema?.uiRoot} />
          </div>
        }
        
      </div>
    </CanvasContext.Provider>
  )
})

export default Canvas