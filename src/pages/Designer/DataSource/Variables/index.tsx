import { DatePicker, Form, Input, InputNumber, Select, Switch } from '@arco-design/web-react'
import React, { useState } from 'react'

type Props = {}

const VarDataSource = (props: Props) => {

  const [dataType, setDataType] = useState('string')
  const [initValue, setInitValue] = useState<any>()

  const handleTypeChange = (type: string) => {
    setDataType(type)
    const defaultValues: any = {
      string: '',
      number: 0,
      boolean: true,
      datetime: Date.now()
    }
    setInitValue(defaultValues[type])
  }

  return (
    <div>
      <Form.Item label="数据类型">
        <Select onChange={handleTypeChange}>
          <Select.Option value={'string'}>字符串</Select.Option>
          <Select.Option value={'number'}>数字</Select.Option>
          <Select.Option value={'boolean'}>开关</Select.Option>
          <Select.Option value={'datetime'}>时间</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item label={'初始值'}>
        {dataType === 'string' && <Input value={initValue} onChange={setInitValue}/>}
        {dataType === 'number' && <InputNumber value={initValue} onChange={setInitValue}/>}
        {dataType === 'boolean' && <Switch checked={initValue} onChange={setInitValue}/>}
        {dataType === 'datetime' && <DatePicker showTime value={initValue} onChange={(str, day) => {
          setInitValue(day.valueOf())
        }}/>}
      </Form.Item>
    </div>
  )
}

export default VarDataSource