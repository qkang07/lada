import React, { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react'
import styles from './index.module.less'
import { Modal, Tabs } from '@arco-design/web-react'
import { observer } from 'mobx-react'
import { DesignerContext } from '@/components/Designer'
import { BindingElement, BindingSchema, BindingType, CompSchemaBase, UIComp } from '@/libs/core/Def'
import { CompAgent } from '@/libs/core/CompAgent'
import BindingCard from './BindingCard'
import { Optional } from '@/utils'


type OpenParams = {
  // 此次寻找的 element 类型
  lookingFor: BindingElement
  // 自己提供的相应的 element 名
  name: string
} 

export type BDPlateType = {
  open(params: OpenParams) : Promise<any>
}


type Props = {
}

const BindingPlate = forwardRef<BDPlateType, Props>((props, ref) => {
  const {bdCon, currentCompAgent} = useContext(DesignerContext)

  const compList: CompAgent[] = []
  bdCon?.agentMap.forEach((comp) => {
    compList.push(comp)
  })

  const [visible, setVisible] = useState(false)

  const [selectedComp, setSelectedComp] = useState<CompAgent>()

  const [selectedElement, setSelectedElement] = useState<string>()

  const contextRef = useRef< {
    params: OpenParams
    resolve: (schema: BindingSchema) => void
  }>()

  const {lookingFor} = contextRef.current?.params || {}


  useImperativeHandle(ref, () => {
    return {
      open(params: OpenParams){
      setVisible(true)
      return new Promise((resolve, reject) => {
        const context: typeof contextRef['current'] = {
          params,
          resolve,
        }
        contextRef.current = context
      })
      }
    }
  }, [])

  const chooseTargetComp = (comp:CompAgent) => {
    setSelectedComp(comp)
  }

  const chooseElement = (prop: string) => {
    setSelectedElement(prop)
  }
  
  const handleOK = () => {
    const {
      params :{lookingFor, name},
      resolve
    } = contextRef.current!
    const schema: Optional<BindingSchema>  = {}
    if(lookingFor === 'prop' || lookingFor === 'state') {
      schema.type = 'state-prop'
    } else {
      schema.type = 'event-action'
    }
    if(lookingFor === 'event' || lookingFor === 'state') {
      schema.source = {
        prop: selectedElement!,
        id: selectedComp?.schema.id!
       
      }
      schema.target = {
        prop: name!,
        id: currentCompAgent?.schema.id!
      }
    } else {
      schema.source = {
        prop: name,
        id: currentCompAgent?.schema.id!
       
      }
      schema.target = {
        prop: selectedElement!,
        id: selectedComp?.schema.id!
      }
    }
    bdCon?.addBinding(schema as BindingSchema)
    resolve?.(schema as BindingSchema)
    setVisible(false)
    setSelectedComp(undefined)
    setSelectedElement(undefined)
  }
  
  return (
    <Modal visible={visible} onCancel={() => {
      setVisible(false)
    }} style={{width: '80%'}} 
      onOk={() => {
        handleOK()
      }}
    >

      <div className={styles.bindingPlate}>
        <div className={styles.compTypeList}>

          <div className={styles.compType}>
            <div className={styles.compTypeTitle}>
              <span>数据</span>
            </div>
            <div className={styles.comps}>
              {bdCon?.schema?.dataSources.map(ds => {
                return <div className={styles.compItem} key={ds.name}>{ds.name}</div>
              })}
            </div>
          </div>
          <div className={styles.compType}>
            <div className={styles.compTypeTitle}>
              <span>组件</span>
            </div>
            <div className={styles.comps}>
              {compList.map(comp => {
                return <div onClick={() =>{chooseTargetComp(comp)}} className={styles.compItem} key={comp.schema.name}>{comp.schema.name}</div>
              })}
            </div>
          </div>
          <div className={styles.compType}>
            <div className={styles.compTypeTitle}>
              <span>环境</span>
            </div>
            <div className={styles.comps}>
              {
                // bdCon?.schema.contextComps.map(compSchema => {
                //   return <div className={styles.compItem}>{compSchema.name}</div>
                // })
              }
              {/* <div className={styles.compItem} onClick={() => {
                chooseTargetComp()
              }}>页面</div> */}
              <div className={styles.compItem}>应用</div>
             
            </div>
          </div>
        
        </div>
        <Tabs activeTab={lookingFor} className={styles.bindingItems}>
          {
            lookingFor === 'prop' && ( <Tabs.TabPane key={'prop'} title='Prop'>
              {selectedComp?.def.props?.map(prop => {
                return <BindingCard selected={selectedElement === prop.name}  key={prop.name}  onClick={() => chooseElement(prop.name)} def={prop}/>
              })}
            </Tabs.TabPane>)
          }
           {
            lookingFor === 'state' && ( <Tabs.TabPane key={'state'} title='State'>
              {selectedComp?.def.states?.map(prop => {
                return <BindingCard selected={selectedElement === prop.name}  key={prop.name}  onClick={() => chooseElement(prop.name)} def={prop}/>
              })}
            </Tabs.TabPane>)
          }
           {
            lookingFor === 'event' && ( <Tabs.TabPane key={'event'} title='Event'>
              {selectedComp?.def.events?.map(prop => {
                return <BindingCard selected={selectedElement === prop.name}  key={prop.name}  onClick={() => chooseElement(prop.name)} def={prop}/>
              })}
            </Tabs.TabPane>)
          }
           {
            lookingFor === 'action' && ( <Tabs.TabPane key={'action'} title='Action'>
              {selectedComp?.def.actions?.map(prop => {
                return <BindingCard selected={selectedElement === prop.name}  key={prop.name}  onClick={() => chooseElement(prop.name)} def={prop}/>
              })}
            </Tabs.TabPane>)
          }
        </Tabs>
        {/* <div className={styles.bindingItems}>
          <div>
            <div>Props</div>
          </div>
          <div>
            <div>States</div>
          </div>
          <div>
            <div>Actions</div>
          </div>
          <div>
            <div>Events</div>
          </div>
          
        </div> */}
      </div>
    </Modal>
  )
})

export default BindingPlate