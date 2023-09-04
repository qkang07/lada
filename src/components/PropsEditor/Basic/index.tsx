import SidePane from '@/components/SidePane'
import React, { useContext } from 'react'
import pstyle from '../index.module.less'
import { Input } from '@arco-design/web-react'
import { compMan } from '@/components/manager'
import { DesignerContext } from '@/components/Designer'
import { observer } from 'mobx-react'

type Props = {}
const BasicProps = observer((props: Props) => {
  const { currentCompAgent} = useContext(DesignerContext);

  
  const schema = currentCompAgent?.schema

  const compDef = compMan.getComp(schema?.provider!);
  return (
    <SidePane title='基本属性'>
      <div className={pstyle.propField}>
        <div className={pstyle.label}>Name</div>
        <Input size='small' value={schema?.name} onChange={v => {
          if(v){
            currentCompAgent?.updateDefaultProp('name', v)
            // compSchema.name = v
            // updateCompSchema?.(compId, compSchema)
          }
        }} />
      </div>
    </SidePane>
  )
})

export default BasicProps