import { CanvasContext } from '@/components/Canvas'
import SidePane from '@/components/SidePane'
import { DesignerContext } from '@/pages/Designer'
import Editor from '@monaco-editor/react'
import React, { useContext, useEffect, useRef, useState } from 'react'

type Props = {
  schemaId: string
  // compId: string
}

const StyleEditor = (props: Props) => {
  const {schemaId} = props

  const [innerValue, setInnerValue] = useState<string>()

  const {} = useContext(CanvasContext)

  const {compSchemaMap} = useContext(DesignerContext)

  const schema = () => compSchemaMap![schemaId]

  useEffect(() => {
    const style = schema().bindings?.find(s => s.prop === 'style')?.binding || ''
    if(style !== innerValue) {
      setInnerValue(style)
    }
  }, [schemaId])


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