import React from 'react'
import styles from './index.module.less'
import { ActionSchema, EventActionDef, SchemaBase, StatePropDef } from '@/libs/core/Def'
import { IconCheckCircleFill } from '@arco-design/web-react/icon'

type Props = {
  def: StatePropDef | EventActionDef
  onClick?: () => void
  selected?: boolean
}

const BindingCard = (props: Props) => {
  const {def, selected} = props
  return (
    <div onClick={props.onClick} className={styles.bdCard}>
      <div>

      <div className={styles.name}>
        {def.name}
        </div>
        <div>{def.valueType}</div>
      </div>
      <div>{selected && <IconCheckCircleFill/>}</div>
    </div>
  )
}

export default BindingCard


