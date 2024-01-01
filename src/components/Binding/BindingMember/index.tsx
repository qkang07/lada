import React, { useContext } from 'react'
import styles from './index.module.less'
import { BindingInfo, CompSchemaBase } from '@/libs/core/Def'
import { DesignerContext } from '@/components/Designer'

type Props = {
  info?: BindingInfo
  type: 'source' | 'target'
  onClick?:() => void
}

const BindingMember = (props: Props) => {
  const {info} = props
  const {bdCon} = useContext(DesignerContext)

  if(info?.id) {

    const schema = bdCon!.schemaAgentMap.get(info.id)?.[0].schema!
    // return 
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
  return <div className={styles.bindingMember} onClick={() => {
    props.onClick?.()
  }}>
    选择组件
  </div>

}

export default BindingMember