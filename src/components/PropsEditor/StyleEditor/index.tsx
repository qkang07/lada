import SidePane from '@/components/SidePane'
import { BindScopeEnum, BindTypeEnum } from '@/components/compDef'
import { DesignerContext } from '@/pages/Designer'
import Editor from '@monaco-editor/react'
import React, { useContext, useEffect, useRef, useState } from 'react'

type Props = {
  compId: string
}

const StyleEditor = (props: Props) => {
  const {compId} = props

  const [innerValue, setInnerValue] = useState<string>()

  const {currentCompId, compSchemaMap} = useContext(DesignerContext)

  const schema = () => compSchemaMap![compId]

  useEffect(() => {
    const style = schema().bindings?.find(s => s.prop === 'style')?.binding || ''
    if(style !== innerValue) {
      setInnerValue(style)
    }
  }, [props.compId])


  return (
    <SidePane title={'样式'}>
      <Editor

        language='css'
        onChange={v => {
          setInnerValue(v)
          // comp().updateBinding({
          //   prop: 'style',
          //   scope: BindScopeEnum.Direct,
          //   type: BindTypeEnum.Model,
          //   binding: v || ''
          // })
          

        }}
        value={innerValue}
        
        options={{
          selectOnLineNumbers: true,
          lineDecorationsWidth: 0,
          lineNumbersMinChars: 4,
          tabSize: 2,
          
        }}
        height={400}
        theme="vs"
      />
    </SidePane>
  )
}

export default StyleEditor