import { DesignerContext } from '@/components/Designer'
import { OptionType, PrimitiveType, PropEditorType, StatePropDef } from '@/libs/core/Def'
import { firstAvailable } from '@/utils'
import { Input, InputNumber, Radio, Select, Switch } from '@arco-design/web-react'
import React, { ReactNode, useContext } from 'react'


function nrmlzOptions(options:OptionType[]) {
  if(!options || !(options instanceof Array)) {
    console.warn('invalid options value!', options)
    return []
  }
  console.log(options)
  return options.map(item => {
    if(typeof item === 'object' && Reflect.has(item, 'value')) {
      const oitem = item as {value: PrimitiveType, label?: string | ReactNode}
      return {
        value: oitem.value,
        label: String(oitem.label || oitem.value)
      }
    }
    return {value: item, label: String(item)}

  })
}

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

const PresetEditor = (props: Props) => {

  const {prop, disabled} = props

  const { currentCompAgent, openBinding, bdCon } = useContext(DesignerContext);
  const compSchema = currentCompAgent?.schema
  
  const value = firstAvailable(compSchema?.defaultProps?.[prop.name] || prop.defaultValue)
  const editor =
  typeof prop.editor === "string" ? { type: DefaultEditorMap[prop.editor] || 'void' } : prop.editor;
  
  const handlePropChange = (name: string, value: any) => {
    currentCompAgent?.updateDefaultProp(name, value)
  }
  
  return (
    <div>
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
                    {editor.options.map((option: any) => {
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
                  <Input.TextArea value={value} onChange={(v) => {
                    handlePropChange(prop.name, v)
                  }}/>
                )}
    </div>
  )
}

export default PresetEditor