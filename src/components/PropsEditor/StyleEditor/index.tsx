import { CanvasContext } from '@/components/Canvas/context'
import SidePane from '@/components/UIKit/SidePane'
import { DesignerContext } from '@/components/Designer'
import Editor from '@monaco-editor/react'
import React, { CSSProperties, useContext, useEffect, useRef, useState } from 'react'
import PropField from '@/components/UIKit/Field'
import { Input, InputNumber, Radio, Select } from '@arco-design/web-react'
import { observer } from 'mobx-react'
import { action } from 'mobx'
import FieldGroup from '@/components/UIKit/FieldGroup'
import { UIComp } from '@/libs/core/Def'

type Props = {
  // compId: string
}

const StyleEditor = observer((props: Props) => {


  const {} = useContext(CanvasContext)

  const {designerStore} = useContext(DesignerContext)


  const def = designerStore.currentAgent!.def
  const schema = designerStore.currentAgent?.schema as UIComp.Schema

  const updateStyle = action((css: CSSProperties) => {
    schema.style = {
      ...schema?.style,
      ...css
    }
  })

  if(!def.render) {
    return <></>
  }

  return (
    <SidePane title={'样式'}>
      <FieldGroup title='字体'>

        <PropField title='字体大小'>
          <InputNumber min={0} value={schema?.style?.fontSize} onChange={v => {
            updateStyle({fontSize: v})
          }}/>
        </PropField>
        <PropField title='字体颜色'>
          <Input type='color' value={schema.style?.color} onChange={v => {
            updateStyle({color: v})
          }}></Input>
        </PropField>
        <PropField title='粗体'>
          <Select options={['normal','light','bold']} value={schema.style?.fontWeight} onChange={v => {
            updateStyle({fontWeight: v})
          }}></Select>
        </PropField>
        <PropField title='对齐'>
          <Radio.Group type='button' value={schema.style?.textAlign} onChange={v => {
            updateStyle({textAlign: v})
          }} defaultValue={'left'}>
            <Radio value={'left'}>左</Radio>
            <Radio value={'center'}>中</Radio>
            <Radio value={'right'}>右</Radio>
          </Radio.Group>
        </PropField>
      </FieldGroup>
      <FieldGroup title='块'>
        <PropField title='内边距'>
          <InputNumber value={schema.style?.padding} onChange={v => {
            updateStyle({padding: v})
          }}/>
        </PropField>
      </FieldGroup>
    </SidePane>
  )
})

export default StyleEditor