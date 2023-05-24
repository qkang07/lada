import React, { useContext, useState } from 'react'
import styles from './index.module.less'
import { Modal } from '@arco-design/web-react'
import { observer } from 'mobx-react'
import { DesignerContext } from '@/pages/Designer'

type Props = {}

const BindingPlate = observer((props: Props) => {
  const {canvasStore} = useContext(DesignerContext)
  const [visible, setVisible] = useState(false)
  
  
  return (
    <Modal visible={visible} footer={null}>

      <div className={styles.bindingPlate}>
        <div className={styles.compTypeList}>

          <div className={styles.compType}>
            <div className={styles.compTypeTitle}>
              <span>数据</span>
            </div>
            <div className={styles.comps}>
              {canvasStore?.dataSources.map(ds => {
                return <div className={styles.compItem} key={ds.schema.name}>{ds.schema.name}</div>
              })}
            </div>
          </div>
          <div className={styles.compType}>
            <div className={styles.compTypeTitle}>
              <span>组件</span>
            </div>
            <div className={styles.comps}>
              {canvasStore?.dataSources.map(ds => {
                return <div className={styles.compItem} key={ds.schema.name}>{ds.schema.name}</div>
              })}
            </div>
          </div>
          <div className={styles.compType}>
            <div className={styles.compTypeTitle}>
              <span>页面</span>
            </div>
            <div className={styles.comps}>
              {canvasStore?.dataSources.map(ds => {
                return <div className={styles.compItem} key={ds.schema.name}>{ds.schema.name}</div>
              })}
            </div>
          </div>
          <div className={styles.compType}>
            <div className={styles.compTypeTitle}>
              <span>应用</span>
            </div>
            <div className={styles.comps}>
              {canvasStore?.dataSources.map(ds => {
                return <div className={styles.compItem} key={ds.schema.name}>{ds.schema.name}</div>
              })}
            </div>
          </div>
        
        </div>
        <div className={styles.bindingItems}>
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
          
        </div>
      </div>
    </Modal>
  )
})

export default BindingPlate