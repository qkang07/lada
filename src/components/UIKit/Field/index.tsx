import React, { ReactNode, useContext } from 'react'
import styles from './index.module.less'
import { Button } from '@arco-design/web-react'
import { StatePropDef } from '@/libs/core/Def'
import { IconLink } from '@arco-design/web-react/icon'
import { DesignerContext } from '@/components/Designer'

type Props = {
  prop?: StatePropDef
  children?: ReactNode
  bound?: boolean
  title?: string
  onBind?: () => void
}

const PropField = (props: Props) => {
  const {prop, bound} = props
  // const { currentCompAgent, openBinding, bdCon } = useContext(DesignerContext);

  return (
    <div className={styles.propField} >
            <div className={styles.title}>
              <span className={styles.label}>{props.title || prop?.label || prop?.name}</span>

              <div className={styles.bd}>
                {(props.bound || props.onBind) && <Button type={bound ? 'primary' : 'secondary'} size="mini" icon={<IconLink />} onClick={() => {
                  props.onBind?.()
                  // openBinding?.('state', prop.name)
                }} ></Button>}
                
              </div>
            </div>
            <div className={styles.content}>
              {props.children}
            </div>
          </div>
  )
}

export default PropField