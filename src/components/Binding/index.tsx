import { BindingSchema, BindingScopeSchema, DataFilterSchema, OptionalBindingSchema } from '@/libs/core/Def'
import React, { useContext, useMemo, useState } from 'react'
import { DesignerContext } from '../Designer'
import { CanvasContext } from '../Canvas/context'
import styles from './index.module.less'
import FilterCode from './Filter/FilterCode'
import BindingMember from './BindingMember'
import FilterButton from './Filter/FilterButton'
import { observer } from 'mobx-react'
import { Menu, Popover } from '@arco-design/web-react'
import { CompAgent } from '@/libs/core/CompAgent'

type Props = {
  schema: OptionalBindingSchema
}

const Binding = observer((props: Props) => {
  const {bdCon} = useContext(CanvasContext)
  const {schema} = props
  const [detailType, setDetailType] = useState<'source'|'filter'|'target'|undefined>()
  const [currentFilter, setCurrentFilter] = useState<DataFilterSchema>()


  return (
    <div>
      <div className={styles.binding}>
        <div className={styles.source}>
          <BindingMember info={schema.source} type='source'  />
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
          <BindingMember info={schema.target} type='target' />
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
})

export default Binding