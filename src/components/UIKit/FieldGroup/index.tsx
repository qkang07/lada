import React, { ReactNode, useState } from 'react'
import styles from './index.module.less'
import { IconArrowRight, IconRight } from '@arco-design/web-react/icon'

type Props = {
  title?: string
  children?: ReactNode
}

const FieldGroup = (props: Props) => {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className={styles.fieldGroup}>
      <div className={styles.title} onClick={() => {
        setExpanded(!expanded)
      }}>{props.title}
        <IconRight style={{transition: 'all .3s', transform: expanded ? 'rotate(90deg)' : undefined}}/>
      </div>
      <div className={styles.content} style={{
        display: expanded ? 'block' : 'none'
      }}>
        {props.children}
      </div>
    </div>
  )
}

export default FieldGroup