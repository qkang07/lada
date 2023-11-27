import { OptionType } from '@/libs/core/Def'
import React from 'react'
import styles from './index.module.less'
import { Button, Input } from '@arco-design/web-react'
import { IconDown, IconUp } from '@arco-design/web-react/icon'


type Props = {
  options?: OptionType[]
  onChange?: (value: OptionType[]) => void
}

const index = (props: Props) => {

  const {options = [], onChange} = props

  const handleUpdate = (index: number, option: OptionType) => {
    options[index] = option
    onChange?.([...options])
  }

  const swap = (i: number, i2: number) => {
    const temp = options[i]
    options[i] = options[i2]
    options[i2] = temp
  }

  return (
    <div className={styles.optionEditor}>
      {options.map((option, i) => {
        return <div key={option.value} className={styles.optionItem}>
          <div>

          <Input value={option.value as string} placeholder={'Value'} onChange={v =>{
            handleUpdate(i, {...option, value: v})
          } }/>
          <Input value={option.label as string} placeholder={'Label'} onChange={v =>{
            handleUpdate(i, {...option, label: v})
          } }/>
          </div>
          <div className={styles.actions}>
            <div>
            <Button icon='+' onClick={() => {
              options.splice(i, 0, {value: '', label: ''})
              onChange?.([...options])
            }}></Button>
            <Button icon={'-'} onClick={() => {
              options.splice(i, 1)
              onChange?.([...options])
            }}></Button>
            </div>
            <div>

            <Button disabled={i === 0} icon={<IconUp/>} onClick={() => {
              swap(i, i-1)
              onChange?.([...options])
            }}></Button>
            <Button disabled={i === options.length - 1} icon={<IconDown/>} onClick={() => {
              swap(i, i+1)
              onChange?.([...options])
            }}></Button>
            </div>
          </div>
        </div>
      })}
    </div>
  )
}

export default index