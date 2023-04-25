import { Button, Space } from '@arco-design/web-react'
import { IconBackward, IconClockCircle } from '@arco-design/web-react/icon';
import React from 'react'

import styles from './index.module.less'

type Props = {
  onSave: () => any
}

const DesignerHeader = (props: Props) => {
  return (
    <div className={styles.designerHeader}>
      <div>
        <Button>
          <IconBackward/>
        </Button>
        <span></span>
      </div>
      <div className={styles.sizes}>
        <Button></Button>
      </div>
      <div>
        <Space>
          <Button>Preview</Button>
          <Button onClick={props.onSave}>Save</Button>
          <Button>Publish</Button>
        </Space>
      </div>
    </div>
  )
}

export default DesignerHeader