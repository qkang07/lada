import React, { useContext } from 'react'
import styles from './index.module.less'
import { BindingInfo, CompSchemaBase } from '@/libs/core/Def'
import { DesignerContext } from '@/components/Designer'
import { Dropdown, Menu, Popover } from '@arco-design/web-react'
import { CompAgent } from '@/libs/core/CompAgent'

type Props = {
  info?: BindingInfo
  type: 'source' | 'target'
  onClick?:() => void
}

const BindingMember = (props: Props) => {
  const {info} = props
  const {bdCon} = useContext(DesignerContext)

  const schema = info?.id ? bdCon!.schemaAgentMap.get(info.id)?.[0].schema! : undefined

  const compList: CompAgent[] = []
  bdCon?.agentMap.forEach((comp) => {
    compList.push(comp)
  })
  
  return <Dropdown trigger={['click']} droplist={<Menu >{
    compList.map((comp) => {
      return <Menu.Item key={comp.id} onClick={() => {
        // bdCon?.setAgent(key)
      }}>
        {comp.schema.name}
      </Menu.Item>
    })
  }</Menu>}>

    <div className={styles.bindingMember} >
      {schema ? <>
        <div className={styles.name}>{schema.name}</div>
          <div className={styles.id}>{schema.id}</div>
          <div className={styles.provider}>{schema.provider}</div>
        </> : <div>选择组件</div>}
    </div>
  </Dropdown>

}

export default BindingMember