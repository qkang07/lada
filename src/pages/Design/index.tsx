import React from 'react'
import styles from './index.module.less'
import { useParams } from 'react-router-dom'
import { useRequest } from 'ahooks'
import { BindingScopeSchema } from '@/libs/core/Def'
import Designer from '@/components/Designer'
import { randomId } from '@/utils'


const defaultPageSchema = () => Promise.resolve<BindingScopeSchema>({
  id: randomId(),
  name: 'New Page',
  provider:'',
  uiRoot: {
    id: randomId(),
    provider: 'listLayout',
    name: 'root',
    slots: [{
      name: 'default',
      children: []
    }],
  },
  contextComps: [
    {
      id: randomId(),
      provider: 'page',
      name: 'page'
    }
  ],
  bindings:[],
  dataSources: []
})


type Props = {}

const index = (props: Props) => {
  const {id} = useParams<{id: string}>()

  const {data: schema} = useRequest(() => {
    return defaultPageSchema()
    
  },{
    refreshDeps: [id]
  })

  return (
    <div>
      <Designer  bdConSchema={schema}/>
    </div>
  )
}

export default index