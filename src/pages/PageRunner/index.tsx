import { PageRuntime, PageSchema } from '@/libs/core/Def'
import React, { useRef } from 'react'

type Props = {}

const index = (props: Props) => {
  const pageSchema = useRef<PageSchema>()
  
  return (
    <div>index</div>
  )
}

export default index