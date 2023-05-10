import React from 'react'
import styles from './index.module.less'

type Props = {}

const ActionsPanel = (props: Props) => {
  return (
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
  )
}

export default ActionsPanel