import { DesignerContext } from '@/components/Designer'
import { OptionType, PrimitiveType, PropEditorType, StatePropDef, TextType } from '@/libs/core/Def'
import { firstAvailable, nrmlzOptions } from '@/utils'
import { Input, InputNumber, Radio, Select, Switch } from '@arco-design/web-react'
import { useDebounceFn } from 'ahooks'
import { action, autorun, observable, observe, toJS } from 'mobx'
import { observer } from 'mobx-react'
import React, { ReactNode, useContext, useEffect, useState } from 'react'
import OptionEditor from './OptionEditor'




const DefaultEditorMap = {
  string: 'string',
  number: 'number',
  boolean: 'boolean',
  record: 'record',
  array: 'void', // TODO Later
  any: 'textarea',
  void: 'void'
}

type Props = {
  prop: StatePropDef
  disabled?: boolean
}

const PresetEditor = observer((props: Props) => {

  const {prop, disabled} = props

  const { designerStore, bdCon } = useContext(DesignerContext);
  const {currentAgent} = designerStore
  const compSchema = currentAgent?.schema
  // console.log('current aaa', toJS(currentAgent), compSchema)
  const value = compSchema?.defaultProps[prop.name]
  const editor =
  typeof prop.editor === "string" ? { type: DefaultEditorMap[prop.editor] || 'void' } : prop.editor;
  
  // const {run: handlePropChange} = useDebounceFn((name: string, value: any) => {
  //   currentCompAgent?.updateDefaultProp(name, value)
  // }, {wait: 400}) 

  const handlePropChange = (name: string, value: any) => {
    console.log('custom props chanmge', name, value, currentAgent)
    currentAgent?.updateDefaultProp(name, value)

  }

  if(prop.editorRender) {
    return <prop.editorRender value={value} onChange={v => {
      handlePropChange(prop.name, v)
    }}/>
  }

  return (
    <>
        {editor?.type === "string" && (
                  <Input
                    disabled={disabled}
                    size="small"
                    value={value}
                    onChange={(v) => {
                      handlePropChange(prop.name, v);
                    }}
                  />
                )}
                {editor?.type === "textarea" && (
                  <Input.TextArea
                  disabled={disabled}
                    value={value}
                    onChange={(v) => {
                      handlePropChange(prop.name, v);
                    }}
                  />
                )}
                {editor?.type === "number" && (
                  <InputNumber
                    size="small"
                    value={value}
                    disabled={disabled}
                    min={editor.config?.min}
                    max={editor.config?.max}
                    step={editor.config?.step}
                    onChange={(v) => {
                      handlePropChange(prop.name, v);
                    }}
                  />
                )}
                {editor?.type === "select" && (
                  <Select
                  disabled={disabled}
                    size="small"
                    options={nrmlzOptions(editor.options)}
                    value={value}
                    onChange={(v) => {
                      handlePropChange(prop.name, v);
                    }}
                  />
                )}
                {editor?.type === "radio" && (
                  <Radio.Group
                  disabled={disabled}
                    size="small"
                    value={value}
                    onChange={(v) => {
                      handlePropChange(prop.name, v);
                    }}
                  >
                    {nrmlzOptions(editor.options).map((option: any) => {
                      return <Radio key={option.value} value={option.value}>{option.label}</Radio>;
                    })}
                  </Radio.Group>
                )}
                {editor?.type === 'boolean' && (
                  <Switch checked={!!value} onChange={(v) => {
                    handlePropChange(prop.name, v)
                  }}/>
                )}
                {editor?.type === 'options' && (
                  <OptionEditor options={value} onChange={v => {
                    console.log('options change:', v)
                    handlePropChange(prop.name, v)
                  }} />
                )}
    </>
  )
})

export default PresetEditor