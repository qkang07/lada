import React from 'react'
import styles from './index.module.less'
import { ActionSchema, PropDef, PropType, SchemaBase } from '@/libs/core/Def'

type Props = {
  def: PropDef
  onClick?: () => void
}

const BindingCard = (props: Props) => {
  const {def} = props
  return (
    <div onClick={props.onClick} className={styles.bdCard}>
      <div>

      <div className={styles.name}>
        {def.name}
        </div>
        <div>{def.type}</div>
      </div>
      <div>{}</div>
    </div>
  )
}

export default BindingCard


