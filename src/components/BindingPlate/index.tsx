import React, { useContext, useEffect, useState } from 'react'
import styles from './index.module.less'
import { Modal, Tabs } from '@arco-design/web-react'
import { observer } from 'mobx-react'
import { DesignerContext } from '@/components/Designer'
import { BindingSchema, CompSchemaBase, PropDef, UIComp } from '@/libs/core/Def'
import { CompAgent } from '@/libs/core/CompAgent'
import BindingCard from './BindingCard'

type Props = {
  type?: 'event' | 'action' | 'state' | 'prop'
  sourceComp?: CompAgent
  sourceProp?: PropDef
  bdType?: BindingSchema['type']
  visible?: boolean
  onClose?: () =>void
}

const BindingPlate = observer((props: Props) => {
  const {visible, sourceComp, sourceProp} = props
  const {bdCon} = useContext(DesignerContext)
  
  const compList: CompAgent[] = []
  bdCon?.compMap.forEach((comp) => {
    compList.push(comp)
  })

  const [targetComp, setTargetComp] = useState<CompAgent>()

  const chooseTargetComp = (comp:CompAgent) => {
    setTargetComp(comp)
  }

  const chooseTarget = (prop: PropDef) => {
    bdCon?.addBinding({
      target: {
        id: targetComp?.schema.id!,
        prop: prop.name
      },
      source: {
        prop:sourceProp?.name!,
        id: sourceComp?.schema.id!
      },
      type: props?.bdType!
    })
  }
  
  return (
    <Modal visible={props.visible} onCancel={props.onClose} style={{width: '80%'}} footer={null}>

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
                return <div onClick={() =>{chooseTarget(comp)}} className={styles.compItem} key={comp.schema.name}>{comp.schema.name}</div>
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
              return <BindingCard onClick={() => chooseTarget(prop)} def={prop}/>
            })}
          </Tabs.TabPane>
          <Tabs.TabPane key={'state'} title='State'>
          {targetComp?.def.states?.map(prop => {
              return <BindingCard onClick={() => chooseTarget(prop)}  def={prop}/>
            })}
          </Tabs.TabPane>
          <Tabs.TabPane key={'event'} title='Event'>
          {targetComp?.def.events?.map(prop => {
              return <BindingCard onClick={() => chooseTarget(prop)}  def={prop}/>
            })}
          </Tabs.TabPane>
          <Tabs.TabPane key={'action'} title='Action'>
          {targetComp?.def.actions?.map(prop => {
              return <BindingCard onClick={() => chooseTarget(prop)}  def={prop}/>
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