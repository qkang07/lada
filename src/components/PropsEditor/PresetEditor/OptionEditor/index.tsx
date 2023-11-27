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

            }}></Button>
            <Button icon={'-'} onClick={() => {

            }}></Button>
            </div>
            <div>

            <Button disabled={i === 0} icon={<IconUp/>} onClick={() => {

            }}></Button>
            <Button disabled={i === options.length - 1} icon={<IconDown/>} onClick={() => {

            }}></Button>
            </div>
          </div>
        </div>
      })}
    </div>
  )
}

export default index