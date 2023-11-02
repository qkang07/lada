import React, { useState, useEffect } from 'react'
import { UIComp } from '@/libs/core/Def'

type ITextProps = {
  text?: any
  [others:string]:any
}

const TextDef: UIComp.Def<ITextProps> = {
  name: '',
  label: '',
  icon: <></>,
  props: [
    {
      name: '',
      valueType: 'string',
      desc: '',
      defaultValue: '',
      editor: {type: 'string'},
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
  onCreate(agent) {
    return agent
  },
  render(props) {
   return <span className={props.classNames} style={props.style}>{props.text}</span>
  }
}

export default TextDef
