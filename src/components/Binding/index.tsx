import { BindingSchema, BindingScopeSchema, DataFilterSchema } from '@/libs/core/Def'
import React, { useContext, useMemo, useState } from 'react'
import { DesignerContext } from '../Designer'
import { CanvasContext } from '../Canvas/context'
import styles from './index.module.less'
import FilterCode from './Filter/FilterCode'
import BindingMember from './BindingMember'

type Props = {
  schema: BindingSchema
}

const Binding = (props: Props) => {
  const {bdCon} = useContext(CanvasContext)
  const {schema} = props
  const [detailType, setDetailType] = useState<'source'|'filter'|'target'|undefined>()
  const [filter, setFilter] = useState<DataFilterSchema>()
  const {sourceComp, targetComp} = useMemo(() => {
    const sourceComp = bdCon?.schemaAgentMap.get(schema.source.id)![0].schema
    const targetComp = bdCon?.schemaAgentMap.get(schema.source.id)![0].schema
    return {sourceComp, targetComp}
  }, [schema])
  return (
    <div>
      <div className={styles.binding}>
        <div className={styles.source}>
          <BindingMember schema={sourceComp!} type='source' prop={schema.source.prop} />
        </div>
        <div className={styles.filters}></div>
        <div className={styles.target}>
        <BindingMember schema={targetComp!} type='target' prop={schema.target.prop} />

        </div>
      </div>
      <div className={styles.details}>
        {(detailType === 'source' || detailType === 'target') && <div>

          </div>}
        {
          detailType === 'filter' && (
            filter?.type === 'custom' && <div>
              <FilterCode schema={filter}/>
            </div> ||
            filter?.type === 'child' && <div></div>
          )
        }
      </div>
    </div>
  )
}

export default Binding