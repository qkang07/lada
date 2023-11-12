import React, { useState, useEffect } from 'react'
import { UIComp } from '@/libs/core/Def'
import { Card } from '@arco-design/web-react'
import SlotHolder from '@/components/SlotHolder'

type IProps = {
  bordered?: boolean
  hoverable?: boolean
  loading?: boolean
  size?: 'default' | 'small'
  [others:string]:any
}

const CardDef: UIComp.Def<IProps> = {
  name: 'card',
  label: '卡片',
  icon: <></>,
  props: [
    {
      name: 'bordered',
      valueType: 'boolean',
      label: '是否有边框',
      editor: {type: 'boolean'},
    },{
      name: 'hoverable',
      valueType: 'boolean',
      label: '是否可悬浮',
      editor: {type: 'boolean'}
    },
    {
      name: 'loading',
      valueType:'boolean',
      label: '是否加载中',
      editor: {type: 'boolean'}
    },
    {
      name: 'size',
      valueType: 'string',
      label: '卡片尺寸',
      defaultValue: 'default',
      editor: {type: 'radio', options: ['default','small']}

    }
  ],
  states: [
    
  ],
  events: [
    {
      name: 'onClick',
      valueType: 'any',
    }
  ],
  actions: [
   
  ],
  slots: [
    {
      name:'default',
      single: false
    }
  ],
  onCreate(agent) {
    return agent
  },
  render(props) {
   return <Card
    bordered={props.bordered}
    hoverable={props.hoverable}
    loading={props.loading}
    size={props.size}
   >
    <SlotHolder schema={props.slots?.[0]} />
   </Card>
  }
}

export default CardDef
