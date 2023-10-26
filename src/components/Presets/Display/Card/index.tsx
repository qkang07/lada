import React, { useState, useEffect } from 'react'
import { UIComp } from '@/libs/core/Def'

type IProps = {

  [others:string]:any
}

const Def: UIComp.Def<IProps> = {
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
      valueType: 'boolean',
      label: '卡片尺寸',
    }typescript-json-schema
  ],
  states: [
    {
      name: '',
      valueType: 'string',
      desc: '',
    }
  ],
  events: [
    {
      name: '',
      valueType: 'string',
      desc: '',
    }
  ],
  actions: [
    {
      name: '',
      valueType: 'string',
      desc: '',
    }
  ],
  slots: [
    {
      name: '',
      type: 'single',
    }
  ],
  create(agent) {

  },
  render(props) {
   return <></>
  }
}

export default Def
