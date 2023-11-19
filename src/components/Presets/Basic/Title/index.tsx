import React, { useState, useEffect } from 'react'
import { UIComp } from '@/libs/core/Def'
import { Typography } from '@arco-design/web-react'

type ITitleProps = {
  level?: 1|2|3|4|5|6
  [others:string]:any,
  text?: string
}

const TitleDef: UIComp.Def<ITitleProps> = {
  name: 'title',
  label: '标题',
  icon: <></>,
  props: [
    {
      name: 'text',
      valueType: 'string',
      desc: '',
      defaultValue: '标题',
      editor: {type: 'string'},
    },{
      name: 'level',
      valueType: 'number',
      desc: '标题等级',
      defaultValue: 1,
      editor: {type: 'select', options: [
        {value: 1},
        {value: 2},
        {value: 3},
        {value: 4},
        {value: 5},
        {value: 6},
      ]}
    }
  ],
  states: [
  
  ],
  events: [

  ],
  actions: [
   
  ],
  onCreate(agent) {
    
  },
  render(props) {
   return <Typography.Title heading={props.level} {...props.domAttrs}>{props.text}</Typography.Title>
  }
}

export default TitleDef
