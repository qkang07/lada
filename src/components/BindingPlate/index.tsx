import React, { useContext, useEffect, useState } from 'react'
import styles from './index.module.less'
import { Modal, Tabs } from '@arco-design/web-react'
import { observer } from 'mobx-react'
import { DesignerContext } from '@/components/Designer'
import { UIComp } from '@/libs/core/Def'

type Props = {
  type?: 'event' | 'action' | 'state' | 'prop'
  visible?: boolean
}

const BindingPlate = observer((props: Props) => {
  const {bdCon} = useContext(DesignerContext)
  
  const compList: UIComp.Schema[] = []
  bdCon?.compMap.forEach((comp) => {
    compList.push(comp.schema)
  })
  
  return (
    <Modal visible={props.visible} footer={null}>

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
                return <div className={styles.compItem} key={comp.name}>{comp.name}</div>
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
          <Tabs.TabPane key={'prop'} title='Prop'></Tabs.TabPane>
          <Tabs.TabPane key={'state'} title='State'></Tabs.TabPane>
          <Tabs.TabPane key={'event'} title='Event'></Tabs.TabPane>
          <Tabs.TabPane key={'action'} title='Action'></Tabs.TabPane>
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