import React, { useState, useEffect } from 'react'
import { UIComp } from '@/libs/core/Def'
import { Alert, AlertProps } from '@arco-design/web-react'

type IAlertProps = {
  // 应该允许 prop 和 slot 结合的类型？
  content?: string
  type?: AlertProps['type'],
  closable?: boolean
  title?: string
  showIcon?: boolean
  onClose?:() => void
  afterClose?: () => void
}

const AlertDef: UIComp.Def<IAlertProps> = {

  name: 'alertDisplay',
  label: '警告提示',
  icon: <></>,
  props: [
    {
      name: 'title',
      valueType: 'string',
      defaultValue: '警告',
      editor: {type: 'string'},
    },
    {
      name: 'content',
      valueType: 'string',
      defaultValue: '内容',
      editor: {type: 'string'},
    },
    {
      name: 'type',
      label: '警告类型',
      valueType: 'string',
      defaultValue: 'info',
      editor: {type: 'select', options: [
        'info','success','warning','error'
      ]},
    },
    {
      name: 'title',
      valueType: 'string',
      defaultValue: '警告',
      editor: {type: 'string'},
    },
    {
      name: 'title',
      valueType: 'string',
      defaultValue: '警告',
      editor: {type: 'string'},
    },
    {
      name: 'title',
      valueType: 'string',
      defaultValue: '警告',
      editor: {type: 'string'},
    },
    {
      name: 'title',
      valueType: 'string',
      defaultValue: '警告',
      editor: {type: 'string'},
    },
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
      name: 'onClose',
      label: '关闭事件',
    },
    {
      name: 'afterClose',
      label: '关闭之后事件'
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

  },
  render(props) {
   return <Alert 
    title={props.title}
    type={props.type}
    closable={props.closable}
    showIcon={props.showIcon}
    content={props.content}
    onClose={props.onClose}
    afterClose={props.afterClose}
    {...props.domAttrs}
    ></Alert>
  }
}

export default AlertDef
