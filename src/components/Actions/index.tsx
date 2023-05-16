import React, { useState } from 'react'
import styles from './index.module.less'
import { Modal } from '@arco-design/web-react'
import { ActionSchema } from '../compDef'
import ActionCard from './ActionCard'

type Props = {}

const ActionsPanel = (props: Props) => {

  const [visible, setVisible] = useState(false)
  const [actions,setActions] = useState<ActionSchema[]>([])
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
          {actions.map(action => {
            return <ActionCard action={action} key={action.name}/>
          })}
        </div>
      </div>
    </Modal>
  )
}

export default ActionsPanel