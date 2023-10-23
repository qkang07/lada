import React, { CSSProperties, ReactNode, forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
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
  actions?: ReactNode
  styles?: CSSProperties
}

export type FocusFrameType = {
  setCompDom(dom?: HTMLElement): void
  setContainer(dom: HTMLElement): void
}

const FocusFrame = forwardRef<FocusFrameType, Props>((props, ref) => {
  const [frameStyle, setFrameStyle] = useState<CSSProperties>({})
  const [actionStyle, setActionStyle] = useState<CSSProperties>({})

  const selfDomRef = useRef<HTMLDivElement>(null)

  const domRef = useRef<{target?: HTMLElement, container?: HTMLElement}>({})

  const observerRef = useRef(new MutationObserver((e) => {
    calcFrame()
  }))

  useImperativeHandle(ref, () => {
    return {
      setCompDom(dom?: HTMLElement){
        domRef.current.target = dom
        observerRef.current.disconnect()
        if(dom) {
          observerRef.current.observe(dom, {
            childList: true,
            subtree: true,
            attributes: true
          })
        }
        calcFrame()
      },
      setContainer(dom: HTMLElement) {
        domRef.current.container = dom
        calcFrame()
      }
    }
  })

  useEffect(() => {
    return () => {
      observerRef.current.disconnect()
    }
  }, [])


  const calcFrame = debounce(() => {
    const frameStyle: CSSProperties = {}
    const actionStyle: CSSProperties = {}
    const {target} = domRef.current
    const container = domRef.current.container || selfDomRef.current?.parentElement
    if(target && container) {
      const targetRect = target.getBoundingClientRect()
      const canvasRect = container.getBoundingClientRect()
      frameStyle.left = targetRect.left - canvasRect.left
      frameStyle.top = targetRect.top - canvasRect.top
      frameStyle.height = target.clientHeight
      frameStyle.width = target.clientWidth
      frameStyle.display = 'block'
  
      actionStyle.top = frameStyle.top + frameStyle.height
      actionStyle.left = frameStyle.left
      actionStyle.display = 'inline-block'
  
    }
    setFrameStyle(frameStyle)
    setActionStyle(actionStyle)
   
  }, 0)

  return (
    <div ref={selfDomRef}>
      <div className={styles.frame}  style={{...frameStyle, ...props.styles}}></div>
      <div className={styles.actions} style={{...actionStyle}}>
        {props.actions}
        <IconDelete/>
      </div>
    </div>
  )
})

export default FocusFrame