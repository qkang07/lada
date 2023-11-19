import React, { useState, useEffect, HTMLAttributeAnchorTarget } from 'react'
import { UIComp } from '@/libs/core/Def'
import { Link } from '@arco-design/web-react'

type ILinkProps = {
  text?: string
  href?: string
  disabled?: boolean
  target?: HTMLAttributeAnchorTarget
  [others:string]:any
}

const LinkDef: UIComp.Def<ILinkProps> = {
  name: '',
  label: '',
  icon: <></>,
  props: [
    {
      name: 'text',
      valueType: 'string',
      desc: '',
      defaultValue: 'link',
      editor: {type: 'string'},
    },
    {
      name: 'href',
      valueType: 'string',
      defaultValue: '#',
      editor: {type: 'string'}
    },
    {
      name:'disabled',
      valueType: 'boolean',
      defaultValue: false,
      editor: {type:'boolean'}
    },{
      name: 'target',
      valueType :'string',
      defaultValue: '_blank',
      editor: {
        type: 'select',
        options: [
          {value:'_self'},
          {value:'_blank'},
          {value:'_top'},
          {value:'_parent'},
        ]
      }
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
   return <Link target={props.target} href={props.href} disabled={props.disabled} {...props.domAttrs}>
    
    {props.children}</Link>
  }
}

export default LinkDef
