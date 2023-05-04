import { CompRuntime, SchemaRuntime } from '@/components/compDef'
import { Tag, Tree } from '@arco-design/web-react'
import React, { useContext, useEffect, useState } from 'react'
import { DesignerContext } from '..'
import { TreeDataType } from '@arco-design/web-react/es/Tree/interface'
import SidePane from '@/components/SidePane'
import { observer } from 'mobx-react'


const makeTreeData = (schemas?: CompRuntime[]): any[] => {
  if(!schemas) {
    return []
  }
  return schemas.map(schema => ({
    title: <div>{schema.renderer} <div style={{color: '#aaa'}}>{schema.name}</div></div> ,
    key: schema.id,
    type: 'comp',
    children: schema.slots?.map(s => {
      return {
        title: <Tag bordered color='green'>{s.name}</Tag> ,
        key: s.id,
        type: 'slot',
        children: makeTreeData(s.children)
      }
    })
  })) 
}


type Props = {
  schema: CompRuntime
}

const TreeView = observer((props: Props) => {

  const {eventBus} = useContext(DesignerContext)
  const [treeData, setTreeData] = useState<TreeDataType[]>([])

  useEffect(() => {
    eventBus?.on('schemaUpdate', ()=>{
      setTreeData(makeTreeData([props.schema]))
    })
  }, [eventBus])


  return (
    <SidePane title='页面树'>
      <Tree size='small' showLine treeData={treeData}></Tree>
    </SidePane>
  )
})

export default TreeView