import React from 'react'
import styles from './index.module.less'
import { ActionSchema } from '@/libs/core/Def'

type Props = {
  action: ActionSchema
  onClick?: () => void
}

const BindingCard = (props: Props) => {
  
  return (
    <div onClick={props.onClick} className={styles.actionCard}>
      <div className={styles.name}></div>
      <div className={styles.params}>
        {props.action.params?.map(p=>{
          return <div key={p.name} className={styles.param}></div>
        })}
      </div>
    </div>
  )
}

export default BindingCard


