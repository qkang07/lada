import React, { CSSProperties, ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import styles from './index.module.less'
import { IconDelete } from '@arco-design/web-react/icon'
import { debounce } from 'lodash-es'

function getDomRect(doms: Element[]) {
  let left = 0
  let top = 0
  let height = 0
  let width = 0
  doms.forEach(dom => {
    const htmlDom = dom as HTMLElement
    if(htmlDom.style && !htmlDom.style.float && htmlDom.style.position !== 'absolute' && htmlDom.style.position !== 'fixed' && htmlDom.style.position !== 'sticky') {

    }
  })
}


type Props = {
  target?: HTMLElement
  canvasDom?: HTMLElement
  actions?: ReactNode
  styles?: CSSProperties
}

const FocusFrame = (props: Props) => {
  const {target, canvasDom} = props
  const [renderState, setRenderState] = useState(0)

  const observerRef = useRef(new MutationObserver((e) => {
    // console.log('dom change',e)
    calcFrame()
  }))


  useEffect(() => {
    if(target) {
      observerRef.current.disconnect()
      observerRef.current.observe(target, {
        childList: true,
        subtree: true,
        attributes: true
      })
      
    }
    return () => {
      observerRef.current.disconnect()
    }
    
  }, [target])

  const calcFrame = debounce(() => {
    setRenderState(Math.random())
  }, 0)

  const style = useMemo(() => {
    const frameStyle: CSSProperties = {
      display: 'none',
      position: 'absolute'
    }
    const actionStyle: CSSProperties = {
      display: 'none',
      position: 'absolute'
    }
    if(target && canvasDom) {
      const targetRect = target.getBoundingClientRect()
      const canvasRect = canvasDom.getBoundingClientRect()
      frameStyle.left = targetRect.left - canvasRect.left
      frameStyle.top = targetRect.top - canvasRect.top
      frameStyle.height = target.clientHeight
      frameStyle.width = target.clientWidth
      frameStyle.display = 'block'

      actionStyle.top = frameStyle.top + frameStyle.height
      actionStyle.left = frameStyle.left
      actionStyle.display = 'inline-block'

    }
    return {
      frameStyle, actionStyle
    }
  }, [renderState, target])



  return (
    <div>
      <div className={styles.frame}  style={{...style.frameStyle, ...props.styles}}></div>
      <div className={styles.actions} style={{...style.actionStyle}}>
        {props.actions}
        <IconDelete/>
      </div>
    </div>
  )
}

export default FocusFrame