import React, { useEffect, useState } from 'react'
import Editor from '@monaco-editor/react'

type Props = {
  lang?: 'json' | 'js' | 'css'
  value?: any
  onChange?: (v: any) => void
}

const CodeEditor = (props: Props) => {
  const [lv, setLv] = useState(props.value)
  useEffect(() => {
    setLv(lv)
  },[props.value])
  return (
        <Editor
          language={props.lang}
          onChange={v => {
            setLv(v)
            props.onChange?.(v)
          }}
          value={lv}

          options={{
            selectOnLineNumbers: true,
            lineDecorationsWidth: 0,
            lineNumbersMinChars: 4,
            tabSize: 2,
            
          }}
          height={800}
          theme="vs"
          />
  )
}

export default CodeEditor