import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { CanvasContext } from '../Canvas'
import { randomId } from '@/utils'
import { UIComp} from '../../libs/core/Def'
import { DesignerContext } from '../Designer'
import { bind, cloneDeep, merge, mergeWith } from 'lodash-es'
import { observer } from 'mobx-react'
import { CompAgent } from '../../libs/core/CompAgent'
import { observable, observe } from 'mobx'




type Props = {
  schema?: UIComp.Schema
}

const Renderer = observer((props: Props) => {

  const {schema} = props

  const {isDesign} = useContext(DesignerContext)

  const {bdCon} = useContext(CanvasContext)

  const agentRef = useRef<CompAgent<UIComp.Schema, UIComp.Def> | undefined>()

  const agent = agentRef.current

  const CompRender = agent?.def.render

  const instanceRef = useRef<any>()

  const [compProps, setCompProps] = useState<Record<string, any>>({})

  const makeProps = () => {
    // 初始化 props
    agent?.def.props?.forEach(prop => {
      compProps[prop.name] = schema?.defaultProps?.[prop.name] || prop.defaultValue 
      agent.onPropChange(prop.name, (v) => {
        compProps[prop.name] = v
        setCompProps({...compProps})
      })
    })

    setCompProps({...compProps})
  }

  useEffect(() => {

    if(schema && bdCon) {
      // observe(schema.defaultProps || observable({}), () => {
      //   console.log('default props change', schema.defaultProps)
      // })
      if(!agentRef.current) {
        // console.log('later agent')
        agentRef.current = new CompAgent(schema, bdCon)
      }
      const agent = agentRef.current
  
      // 绑定 action
      if(!isDesign) {

        agent.def.actions?.forEach(act => {
          agent.onActionCall(act.name, (params) => {
            if(typeof instanceRef.current[act.name] === 'function') {
              instanceRef.current[act.name](params)
            }
          })
        })
      }

      makeProps()
    }
    return () => {
      console.log('comp destory')
    }

  }, [schema, bdCon])


  // 设计时会改变 default props
  useEffect(() => {
    // console.log('default props', schema?.defaultProps)
    makeProps()
  }, [schema?.defaultProps])

  const renderProps: UIComp.RenderProps = {
    // agent,
    updateState: (state: string, value? :any) => {
      agent?.updateState({[state]: value})
    },
    ...compProps,
  }

  // 绑定 event
  agent?.def.events?.forEach(ev => {
    renderProps[ev.name] = (payload: any) => {
      // console.log('comp emit event', ev.name, payload)
      agent.emitEvent(ev.name, payload)
    }
  })

  

  
  if(CompRender) {

    return <>
    {
      isDesign && <span data-lada-comp-id={agent?.id}></span>
    }
      <CompRender ref={instanceRef} slots={schema?.slots} {...renderProps} />
    </>
  } else if(schema && bdCon) {
    return <span>未找到组件 {schema.provider}</span>
  }
  return <></>
})

export default Renderer