import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { CanvasContext } from '../Canvas'
import { randomId } from '@/utils'
import { CompInstanceBase, UIComp} from '../../libs/core/Def'
import { DesignerContext } from '../Designer'
import { bind, cloneDeep, merge, mergeWith } from 'lodash-es'
import { observer } from 'mobx-react'
import { CompAgent } from '../../libs/core/CompAgent'

type Props = {
  schema: UIComp.Schema
  props?: any
}

const Renderer = observer((props: Props) => {

  const {schema} = props

  const {isDesign} = useContext(DesignerContext)

  const {bdCon} = useContext(CanvasContext)

  const agentRef = useRef<CompAgent<UIComp.Schema, UIComp.Def>>(new CompAgent(schema))

  const agent = agentRef.current

  const CompRender = agent.def.render

  const instanceRef = useRef<any>()

  const [compProps, setCompProps] = useState<Record<string, any>>({})

  useEffect(() => {
    bdCon.regComp(agent)

    // 绑定 action
    agent.def.actions?.forEach(act => {
      agent.onActionCall(act.name, (params) => {
        if(typeof instanceRef.current[act.name] === 'function') {
          instanceRef.current[act.name](params)
        }
      })
    })


    // 初始化 props
    agent.def.props?.forEach(prop => {
      compProps[prop.name] = schema.defaultProps?.[prop.name] || prop.defaultValue 
      agent.onPropChange(prop.name, (v) => {
        compProps[prop.name] = v
        setCompProps({...compProps})
      })
    })

    setCompProps({...compProps})
  }, [schema])

  const renderProps: UIComp.RenderProps = {
    // agent,
    updateState: (state: string, value? :any) => {
      agent.updateState({[state]: value})
    },
    ...agent.state,
    
    // TODO: 这里要初始化 props
  }

  // 绑定 event
  agent.def.events?.forEach(ev => {
    renderProps[ev.name] = (payload: any) => {
      agent.emitEvent(ev.name, payload)
    }
  })

  

  
  if(CompRender) {
    return <>
    {
      isDesign && <span data-lada-comp-id={schema.id}></span>
    }
      <CompRender ref={instanceRef} slots={schema.slots} {...renderProps} />
    </>
  }
  return <span>未找到组件 {schema.provider}</span>
})

export default Renderer