import SidePane from '@/components/SidePane'
import React, { useContext } from 'react'
import pstyle from '../index.module.less'
import { Input } from '@arco-design/web-react'
import { compMan } from '@/components/manager'
import { DesignerContext } from '@/pages/Designer'
import { observer } from 'mobx-react'

type Props = {compId: string}
const BasicProps = observer((props: Props) => {
  const { compId} = props
  const { compSchemaMap, updateCompSchema} = useContext(DesignerContext);

  
  const compSchema = compSchemaMap![compId];

  const compDef = compMan.getComp(compSchema.renderer);
  return (
    <SidePane title='基本属性'>
      <div className={pstyle.propField}>
        <div className={pstyle.label}>Name</div>
        <Input size='small' value={compSchema.name} onChange={v => {
          if(v){
            compSchema.name = v
            updateCompSchema?.(compId, compSchema)
          }
        }} />
      </div>
    </SidePane>
  )
})

export default BasicProps