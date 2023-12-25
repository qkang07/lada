import { CustomFilterSchema } from '@/libs/core/Def'
import { Editor } from '@monaco-editor/react'
import { action } from 'mobx'
import { observer } from 'mobx-react'
import React from 'react'

type Props = {
  schema: CustomFilterSchema
}

const FilterCode = observer((props: Props) => {
  const [code, setCode] = React.useState(props.schema.customFunc || '')
  const handleChange = action((v: string) => {
    setCode(v)
    props.schema.customFunc = v
  })
  return (
    <div>
      <Editor
        language='javascript'
        value={code}
        height={400}
        width={300}
        onChange={v => {
          handleChange(v || '')
        }}
      />
    </div>
  )
})

export default FilterCode