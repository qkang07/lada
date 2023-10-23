import React, { ReactNode, createContext, useContext, useState } from 'react'
import styles from './index.module.less'
import { IconMinus, IconPlus } from '@arco-design/web-react/icon'





export type NodeDataType<T = any> = {
  content?: string | ReactNode
  children?: NodeDataType<T>[]
  id: string | number
  rawData?: T
  
}


const TreeContext = createContext<{
  indent?: number
  onNodeClick?: (node: NodeDataType) => void
}>({})


type NodeProps = {
  node: NodeDataType
  level: number
}

const TreeNode =  (props: NodeProps) => {
  const {indent, onNodeClick} = useContext(TreeContext)
  const [expanded, setExpanded] = useState(false)
  const style = {
    // paddingLeft: props.level * (indent || 0)
  }
  return <div className={`${styles.treeNode}`} style={{...style}}>
    <div className={styles.content}>
      <div className={styles.expander} onClick={() => {
        setExpanded(!expanded)
      }}>
        {expanded ? <IconMinus/> : <IconPlus/>}
      </div>
      <div className={styles.nodeTitle} onClick={() => onNodeClick?.(props.node)}>
        {props.node.content}
      </div>
    </div>
    <div className={styles.children} style={{display: expanded ? 'block' : 'none'}}>
      {props.node.children?.map(n => {
        return <TreeNode node={n} key={n.id} level={props.level + 1}/>
      })}
    </div>
  </div>
}



type Props = {
  onNodeClick?: (node: NodeDataType) => void
  data: NodeDataType[]
  
}

const TreeView = (props: Props) => {

  const handleNodeClick = (node: NodeDataType) => {

  }
  return (
    <TreeContext.Provider value={{
      onNodeClick: handleNodeClick,
      indent: 10
    }}>
      <div className={styles.treeView}>
        {props.data.map(d => {
          return <TreeNode key={d.id} level={0} node={d}/>
        })}
      </div>
    </TreeContext.Provider>
  )
}

export default TreeView