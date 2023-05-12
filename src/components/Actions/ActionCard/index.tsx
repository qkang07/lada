import React from 'react'
import styles from './index.module.less'
import { ActionSchema } from '@/components/compDef'

type Props = {
  action: ActionSchema
}

const ActionCard = (props: Props) => {
  
  return (
    <div>
      <div className={styles.name}></div>
      <div className={styles.params}>
        {props.action.params?.map(p=>{
          return <div key={p.name} className={styles.param}></div>
        })}
      </div>
    </div>
  )
}

export default ActionCard