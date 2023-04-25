import React, { ReactNode, useState } from 'react'
import styles from './index.module.less'

type Props = {
  title: string
  icon?: ReactNode
  actions?: ReactNode[]
  children?: ReactNode
}

const SidePane = (props: Props) => {
  const [expanded, setExpanded] = useState(true)
  const toggle = () => {
    setExpanded(!expanded)
  }
  return (
    <div className={styles.sidePane} onClick={toggle}>
      <div className={styles.paneTitle}>
        <div>
          <span>{props.icon}</span>
          <span>{props.title}</span>
        </div>
        <div className={styles.actions}>{props.actions}</div>
      </div>
      <div className={styles.paneBody}>{props.children}</div>
    </div>
  )
}

export default SidePane