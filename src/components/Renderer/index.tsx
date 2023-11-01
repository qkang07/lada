import React, { useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { CanvasContext } from '../Canvas/context'
import { randomId } from '@/utils'
import { UIComp} from '../../libs/core/Def'
import { DesignerContext } from '../Designer'
import { bind, cloneDeep, merge, mergeWith } from 'lodash-es'
import { CompAgent } from '../../libs/core/CompAgent'
import { observer } from 'mobx-react'
import styles from './index.module.less'



type Props = {
  schema?: UIComp.Schema
  slot: UIComp.SlotSchema
}

const Renderer = observer((props: Props) => {

  const {schema} = props

  const {isDesign} = useContext(DesignerContext)

  const {bdCon} = useContext(CanvasContext)

  const agentRef = useRef<CompAgent<UIComp.Schema, UIComp.Def> | undefined>()

  const agent = agentRef.current

  const CompRender = agent?.def.render

  const instanceRef = useRef<any>()

  const flagRef = useRef<HTMLElement>(null)

  const [compProps, setCompProps] = useState<Record<string, any>>({})

  useEffect(() => {
    // console.log(schema, bdCon)
    if(schema && bdCon) {

      if(!agentRef.current) {
        agentRef.current = new CompAgent(schema)
        bdCon.regComp(agentRef.current)
        const agent = agentRef.current
        agent.parentSlot = props.slot
        agent.findDom = () => {
          if(flagRef.current) {
            return flagRef.current.nextElementSibling as HTMLElement
          }
        }
        // 绑定 action
        if(!isDesign) {
  
          agent.def.meta.actions?.forEach(act => {
            agent.onActionCall(act.name, (params) => {
              if(typeof instanceRef.current[act.name] === 'function') {
                instanceRef.current[act.name](params)
              } else if(typeof agent.instance[act.name] === 'function') {
                agent.instance[act.name](params)
              }
            })
          })
  
          agent.def.meta.props?.forEach(prop => {
            agent.onPropChange(prop.name, (v) => {
              compProps[prop.name] = v
              setCompProps({...compProps})
            })

          })
        } else {
          // 设计时监听 schema change
          agent.onSchemaChange(() => {
            makeProps()
          })
        }
      }
      
      makeProps()

    }
    return () => {
      console.log('comp destory')
    }

  }, [schema, bdCon])

  const makeProps = () => {
    // console.log(agentRef.current?.schema)
    const initProps = cloneDeep(agentRef.current?.schema?.defaultProps || {})
    setCompProps(initProps)
  }

  // 设计时会改变 default props
  // useEffect(() => {
  //   makeProps()
  // }, [schema?.defaultProps])

  const renderProps: UIComp.RenderProps = {
    // agent,
    updateState: (state: string, value? :any) => {
      agent?.updateState({[state]: value})
    },
    ...compProps,
    state: agent?.state
  }

  // 绑定 event
  agent?.def.meta.events?.forEach(ev => {
    renderProps[ev.name] = (payload: any) => {
      // console.log('comp emit event', ev.name, payload)
      agent.emitEvent(ev.name, payload)
    }
  })

  

  
  if(CompRender) {

    return <>
      <span ref={flagRef} className={styles.compFlag} data-lada-comp-id={agent?.id}></span>
      <CompRender ref={instanceRef} slots={schema?.slots} {...renderProps} />
    </>
  } 
  // else if(schema && bdCon) {
  //   return <span>未找到组件 {schema.provider}</span>
  // }
  return <></>
})

export default Renderer