import { UICompRegTable } from '@/components/CompManager/RegList'
import SidePane from '@/components/SidePane'
import { Button } from '@arco-design/web-react'
import React from 'react'
import styles from './index.module.less'
type Props = {
  onCompClick?: (name: string) => void
}

const CompBox = (props: Props) => {

  return (
    <SidePane title='组件'>
      {
        UICompRegTable.map(cat => {
          return <div className={styles.cat} key={cat.category}>
            <div className={styles.catTitle}>{cat.label}</div>
            <div className={styles.items}>
              {cat.items.map(item => {
                return <Button long key={item.meta.name} onClick={() => props.onCompClick?.(item.meta.name)}>{item.meta.label || item.meta.name}</Button>
              })}
            </div>
          </div>
        })
      }
    </SidePane>
  )
}

export default CompBox