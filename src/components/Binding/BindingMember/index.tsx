import React from 'react'
import styles from './index.module.less'
import { CompSchemaBase } from '@/libs/core/Def'

type Props = {
  schema: CompSchemaBase
  type: 'source' | 'target'
  prop: string
  onClick?:() => void
}

const BindingMember = (props: Props) => {
  const {schema} = props
  return (
    <div className={styles.bindingMember} onClick={() => {
      console.log(schema)
      props.onClick?.()
    }}>
      <div className={styles.name}>{schema.name}</div>
      <div className={styles.id}>{schema.id}</div>
      <div className={styles.provider}>{schema.provider}</div>
    </div>
  )
}

export default BindingMember