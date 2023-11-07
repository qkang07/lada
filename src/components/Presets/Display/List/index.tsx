import {UIComp } from '@/libs/core/Def'
import React, { CSSProperties } from 'react'
import styles from './index.module.less'
import SlotHolder from '@/components/SlotHolder'

type ListLayoutProps = {
  direction?: 'vertical' | 'horizon'
  styleString?: string
}

const ListLayoutDef: UIComp.Def<ListLayoutProps> = {
  name: 'listLayout',
  label: '列表布局',
  props: [
    {
      name: 'direction',
      label: '方向',
      defaultValue: 'vertical',
      editor: {
        type: 'radio',
        config: [
          {label: '竖向', value: 'vertical'},
          {label: '横向', value: 'horizon'},
        ]
      }
    }
  ],
  slots: [
    {name: 'default', single: false}
  ],
  onSchemaCreate(initSchema) {
    initSchema.slots = [{
      name: 'default',
      children: []
    }]
      return initSchema
  },
  render: (props) => {
    const style: CSSProperties = {}
    if(props.direction === 'horizon') {
      style.display = 'flex'
    }
    const defaultSlot = props.slots?.[0]
    return <div style={style} className={styles.listLayout}>
      {
        defaultSlot ? <SlotHolder schema={defaultSlot} /> : <></>
      }
    </div>
  }
}

export default ListLayoutDef