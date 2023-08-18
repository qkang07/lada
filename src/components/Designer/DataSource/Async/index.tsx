import { Form, Select } from '@arco-design/web-react'
import React from 'react'

type Props = {}

const AsyncDataSource = (props: Props) => {
  return (
    <div>
      <Form.Item label="数据提供者">
        <Select/>
      </Form.Item>
    </div>
  )
}

export default AsyncDataSource