import { UIComp } from '@/libs/core/Def'
import { Tag, Tree } from '@arco-design/web-react'
import React, { useContext, useEffect, useState } from 'react'
import { TreeDataType } from '@arco-design/web-react/es/Tree/interface'
import SidePane from '@/components/SidePane'
import { observer } from 'mobx-react'


const makeTreeData = (schemas?: UIComp.Schema[]): any[] => {
  if(!schemas) {
    return []
  }
  return schemas.map(schema => ({
    title: <div>{schema.provider} <div style={{color: '#aaa'}}>{schema.name}</div></div> ,
    key: schema.name,
    type: 'comp',
    children: schema.slots?.map(s => {
      return {
        title: <Tag bordered color='green'>{s.name}</Tag> ,
        key: s.name,
        type: 'slot',
        children: makeTreeData(s.children)
      }
    })
  })) 
}


type Props = {
  schema?: UIComp.Schema
  onChoose?: (id: string) => void
}

const TreeView = observer((props: Props) => {

  const [treeData, setTreeData] = useState<TreeDataType[]>([])

  useEffect(() => {
    if(props.schema) {
      setTreeData(makeTreeData([props.schema]))
    }
  }, [props.schema])


  return (
    <SidePane title='页面树'>
      <Tree size='small' showLine treeData={treeData}></Tree>
    </SidePane>
  )
})

export default TreeView