import React, { CSSProperties, ReactNode, useState } from 'react'
import styles from './index.module.less'
import { IconMinus, IconPlus } from '@arco-design/web-react/icon'

type Props = {
  title: string
  icon?: ReactNode
  // actions?: ReactNode
  expandable?: boolean
  children?: ReactNode
}

const SidePane = (props: Props) => {
  const [expanded, setExpanded] = useState(true)
  const toggle = () => {
    setExpanded(!expanded)
  }
  return (
    <div className={styles.sidePane} >
      <div className={styles.paneTitle} onClick={toggle}>
        <div>
          <span>{props.icon}</span>
          <span>{props.title}</span>
        </div>
        <div className={styles.actions}>
          {expanded ? <IconMinus/> : <IconPlus/>}
        </div>
      </div>
      <div className={styles.paneBody} style={{
        display: expanded ? 'block' : 'none'
      }}>{props.children}</div>
    </div>
  )
}

type ItemProps = {
  children?: ReactNode
  onClick?: () => void
  className?: string
  style?: CSSProperties
}

const SidePaneItem = (props: ItemProps) => {
  return <div className={`${styles.listItem} ${props.className || ''}`}
    style={{...props.style}}
    onClick={props.onClick}
  >{props.children}</div>
}

export {SidePaneItem} 

export default SidePane