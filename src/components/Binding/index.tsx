import { BindingSchema, BindingScopeSchema, DataFilterSchema } from '@/libs/core/Def'
import React, { useContext, useMemo, useState } from 'react'
import { DesignerContext } from '../Designer'
import { CanvasContext } from '../Canvas/context'
import styles from './index.module.less'
import FilterCode from './Filter/FilterCode'
import BindingMember from './BindingMember'
import FilterButton from './Filter/FilterButton'

type Props = {
  schema: BindingSchema
}

const Binding = (props: Props) => {
  const {bdCon} = useContext(CanvasContext)
  const {schema} = props
  const [detailType, setDetailType] = useState<'source'|'filter'|'target'|undefined>()
  const [currentFilter, setCurrentFilter] = useState<DataFilterSchema>()
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
        <div className={styles.filters}>
          {schema.filters?.map(ft => {
            return <FilterButton filter={ft} onClick={() => {
              setDetailType('filter')
              setCurrentFilter(ft)
            }}/>
          })}
        </div>
        <div className={styles.target}>
        <BindingMember schema={targetComp!} type='target' prop={schema.target.prop} />

        </div>
      </div>
      <div className={styles.details}>
        {(detailType === 'source' || detailType === 'target') && <div>

          </div>}
        {
          detailType === 'filter' && (
            currentFilter?.type === 'custom' && <div>
              <FilterCode schema={currentFilter}/>
            </div> ||
            currentFilter?.type === 'child' && <div>child filter</div>
          )
        }
      </div>
    </div>
  )
}

export default Binding