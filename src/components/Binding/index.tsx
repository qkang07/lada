import { BindingSchema, BindingScopeSchema, DataFilterSchema } from '@/libs/core/Def'
import React, { useContext, useState } from 'react'
import { DesignerContext } from '../Designer'
import { CanvasContext } from '../Canvas/context'
import styles from './index.module.less'
import FilterCode from './Filter/FilterCode'

type Props = {
  schema: BindingSchema
}

const Binding = (props: Props) => {
  const {bdCon} = useContext(CanvasContext)
  const {schema} = props
  const [detailType, setDetailType] = useState<'source'|'filter'|'target'|undefined>()
  const [filter, setFilter] = useState<DataFilterSchema>()
  return (
    <div>
      <div className={styles.binding}>
        <div className={styles.source}>
          <div></div>
        </div>
        <div className={styles.filters}></div>
        <div className={styles.target}></div>
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