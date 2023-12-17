import { UICompRegTable } from '@/components/CompManager/RegList'
import SidePane from '@/components/UIKit/SidePane'
import { Button, Space } from '@arco-design/web-react'
import React from 'react'
import styles from './index.module.less'
import FieldGroup from '@/components/UIKit/FieldGroup'
type Props = {
  onCompClick?: (name: string) => void
}

const CompBox = (props: Props) => {

  return (
    <SidePane title='组件'>
      {
        UICompRegTable.map(cat => {
          return <FieldGroup title={cat.label}  key={cat.category}>
            <Space wrap className={styles.items}>
              {cat.items.map(item => {
                return <Button long key={item.name} onClick={() => props.onCompClick?.(item.name)}>{item.label || item.name}</Button>
              })}
            </Space>
          </FieldGroup>
        })
      }
    </SidePane>
  )
}

export default CompBox