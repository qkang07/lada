import React, { useContext, useEffect, useState } from 'react'
import styles from './index.module.less'
import { Modal, Tabs } from '@arco-design/web-react'
import { observer } from 'mobx-react'
import { DesignerContext } from '@/components/Designer'
import { BindingSchema, BindingType, CompSchemaBase, UIComp } from '@/libs/core/Def'
import { CompAgent } from '@/libs/core/CompAgent'
import BindingCard from './BindingCard'

type Props = {
  type?: 'event' | 'action' | 'state' | 'prop'
  sourceProp?: string
  bdType?: BindingType
  visible?: boolean
  onClose?: () =>void

}

const BindingPlate = observer((props: Props) => {
  const {visible, sourceProp} = props
  const {bdCon, currentCompAgent} = useContext(DesignerContext)

  const sourceComp = currentCompAgent
  



  const compList: CompAgent[] = []
  bdCon?.compMap.forEach((comp) => {
    compList.push(comp)
  })


  const [targetComp, setTargetComp] = useState<CompAgent>()

  const [targetProp, setTargetProp] = useState<string>()

  const chooseTargetComp = (comp:CompAgent) => {
    setTargetComp(comp)
  }

  const chooseTarget = (prop: string) => {
    setTargetProp(prop)
  }
  
  const handleOK = () => {
    bdCon?.addBinding({
      target: {
        id: targetComp?.schema.id!,
        prop: targetProp!
      },
      source: {
        prop:sourceProp!,
        id: sourceComp?.schema.id!
      },
      type: props?.bdType!
    })
    props.onClose?.()
  }
  
  return (
    <Modal visible={visible} onCancel={props.onClose} style={{width: '80%'}} 
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
              <div className={styles.compItem}>页面</div>
              <div className={styles.compItem}>应用</div>
             
            </div>
          </div>
        
        </div>
        <Tabs className={styles.bindingItems}>
          <Tabs.TabPane key={'prop'} title='Prop'>
            {targetComp?.def.props?.map(prop => {
              return <BindingCard selected={targetProp === prop.name}  key={prop.name}  onClick={() => chooseTarget(prop.name)} def={prop}/>
            })}
          </Tabs.TabPane>
          <Tabs.TabPane key={'state'} title='State'>
          {targetComp?.def.states?.map(prop => {
              return <BindingCard selected={targetProp === prop.name}  key={prop.name}  onClick={() => chooseTarget(prop.name)}  def={prop}/>
            })}
          </Tabs.TabPane>
          <Tabs.TabPane key={'event'} title='Event'>
          {targetComp?.def.events?.map(prop => {
              return <BindingCard selected={targetProp === prop.name} key={prop.name} onClick={() => chooseTarget(prop.name)}  def={prop}/>
            })}
          </Tabs.TabPane>
          <Tabs.TabPane key={'action'} title='Action'>
          {targetComp?.def.actions?.map(prop => {
              return <BindingCard selected={targetProp === prop.name}  key={prop.name}  onClick={() => chooseTarget(prop.name)}  def={prop}/>
            })}
          </Tabs.TabPane>
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