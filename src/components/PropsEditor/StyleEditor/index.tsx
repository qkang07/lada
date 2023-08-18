import { CanvasContext } from '@/components/Canvas'
import SidePane from '@/components/SidePane'
import { DesignerContext } from '@/components/Designer'
import Editor from '@monaco-editor/react'
import React, { useContext, useEffect, useRef, useState } from 'react'

type Props = {
  // compId: string
}

const StyleEditor = (props: Props) => {


  const {} = useContext(CanvasContext)

  const {currentCompAgent} = useContext(DesignerContext)

  const schema = currentCompAgent?.schema


  return (
    <SidePane title={'样式'}>
      <Editor

        language='css'
        onChange={v => {
          currentCompAgent?.updateDefaultProp('style', v)
          // comp().updateBinding({
          //   prop: 'style',
          //   scope: BindScopeEnum.Direct,
          //   type: BindTypeEnum.Model,
          //   binding: v || ''
          // })
          

        }}
        value={schema?.defaultProps?.['style']}
        
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