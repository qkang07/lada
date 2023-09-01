import React, { useRef } from 'react'
import styles from './index.module.less'
import Canvas from '@/components/Canvas'
import { observable } from 'mobx'
import { BindingScopeSchema } from '@/libs/core/Def'

type Props = {}

export const schemaRef: {value?:BindingScopeSchema} = {}

const PageRunner =  (props: Props) => {
  console.log('run schema', schemaRef.value)
  return (
    <div>
      <div className={styles.canvasWrapper}>
        <Canvas initSchema={schemaRef.value}/>
      </div>
    </div>
  )
}

export default PageRunner