import React, { useState, useEffect, ReactNode } from 'react'
import { UIComp } from '@/libs/core/Def'
import { Avatar } from '@arco-design/web-react'

type IAvatarProps = {
  size?: number
  shape?: 'circle' | 'square',
  onClick?: () => void
  children?: ReactNode
  [others:string]:any
}

const AvatarDef: UIComp.Def<IAvatarProps> = {
  name: 'avatar',
  label: '头像',
  icon: <></>,
  props: [
    {
      name: 'size',
      valueType: 'number',
      desc: '',
      editor: {type: 'number'},
    },
    {
      name: 'shape',
      valueType: 'string',
      editor: {type: 'select', config: ['circle','square']}
    }
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
      name: 'onClick',
      label: '点击',
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
      name: 'default',
      type: 'single'
    }
  ],
  create(agent) {

  },
  render(props) {
   return <Avatar shape={props.shape}
    size={props.size}
    onClick={props.onClick}
    className={props.classNames}
    style={props.style}
   >{props.children}</Avatar>
  }
}

export default AvatarDef
