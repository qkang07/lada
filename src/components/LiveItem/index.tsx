/**
 * item 组件，给常用的「灵活」item 提供通用样式。
 */


import React, { ReactNode } from 'react'
import styles from './index.module.less'

type Props = {
  title?: string
  right?: any
  onClick?: () => void
}

const LiveItem = (props: Props) => {
  return (
    <div className={styles.liveItem} onClick={props.onClick}>
      <span>
        {props.title}
      </span>
      <span>{props.right}</span>
    </div>
  )
}

export default LiveItem