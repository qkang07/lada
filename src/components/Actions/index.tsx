import React, { useState } from 'react'
import styles from './index.module.less'
import { Modal } from '@arco-design/web-react'

type Props = {}

const ActionsPanel = (props: Props) => {

  const [visible, setVisible] = useState(false)
  return (
    <Modal visible={visible}>

      <div className={styles.actionsPanel}>
        <div className={styles.actionList}>

          <div className={styles.actionTypes}>
            <div className={styles.actionTypeTitle}>
              <span>数据</span>
            </div>
            <div className={styles.actions}></div>
          </div>
          <div className={styles.actionTypes}>
            <div className={styles.actionTypeTitle}>
              <span>组件</span>
            </div>
            <div className={styles.actions}></div>

          </div>
          <div className={styles.actionTypes}>
            <div className={styles.actionTypeTitle}>
              <span>页面</span>
            </div>
            <div className={styles.actions}></div>

          </div>
          <div className={styles.actionTypes}>
            <div className={styles.actionTypeTitle}>
              <span>应用</span>
            </div>
            <div className={styles.actions}></div>

          </div>
        </div>
        <div className={styles.actionDetail}>
          
        </div>
      </div>
    </Modal>
  )
}

export default ActionsPanel