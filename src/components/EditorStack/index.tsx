import { ResizeBox } from '@arco-design/web-react'
import React, { ReactNode } from 'react'
import styles from './index.module.less'

type Props = {
  items: ReactNode[]
}

const EditorStack = (props: Props) => {
  return <>
    {props.items.map((item,i ) => {
      return <ResizeBox key={i} directions={['bottom']}  resizeTriggers={{
        bottom: <div className={styles.resizerLine}></div>
      }}
    style={{
      minHeight: 50
    }}>
        {item}
      </ResizeBox>
    })}
  </>
}

export default EditorStack