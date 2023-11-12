import { UIComp } from "@/libs/core/Def";
import { Carousel } from "@arco-design/web-react";
import { CarouselHandle } from "@arco-design/web-react/es/Carousel/interface";
import { ReactNode, forwardRef, useEffect, useImperativeHandle, useRef } from "react";

type CarouselType = {
  minRender?: boolean
  currentIndex?: number
  moveSpeed?: number
  timingFunc?: string
  animation?: 'slide' | 'card' | 'fade'
  direction?: 'horizontal' | 'vertical'
  indicatorPosition?: 'bottom' | 'top' | 'left' | 'right' | 'outer'
  indicatorType?: 'line' | 'dot' | 'slider' | 'never'
  showArrow?: 'always' | 'hover' | 'never'
  trigger?: 'click' | 'hover'
  arrowClassName?: string[]
  autoPlay?: boolean
  interval?: number
  hoverToPause?: boolean
  indicatorClassName?: string[]
  onChange?: (index: number, prevIndex: number, isManual: boolean) => void
  children?: ReactNode[]
}


const CarouselDef : UIComp.Def<CarouselType> = {
  name: 'carousel',
  label: '轮播图',
  
  events: [
    {
      name: 'onChange',
      label: '切换事件',
      valueType: 'record' // TODO 复杂参数类型
      
    }
  ],
  actions: [
    {
      name: 'goto',
      valueType: 'number',
    },
  ],

  props: [
    {
      name: 'minRender',
      valueType :'boolean',
    },
    {
      name: 'currentIndex',
      valueType: 'number'
    },
    {
      name: 'moveSpeed',
      valueType: 'number',
      editor: {
        type: 'number',
        config: {
          min: 1,
          step: 1
        }
      }
    },
    {
      name: 'timingFunc',
      valueType: 'string'
    },
    {
      name: 'animation',
      valueType: 'string',
      editor: {
        type: 'select',
        options: ['slide','card','fade']
      }
    },
    {
      name: 'direction',
      valueType: 'string',
      editor: {
        type: 'select',
        options: ['horizontal','vertical']
      }
    },
    {
      name: 'indicatorPosition',
      valueType: 'string',
      editor: {
        type: 'select',
        options: ['bottom','top','left','right','outer']
      }
    },
    {
      name: 'indicatorType',
      // TODO ...
    }
    // TODO ...
  ],

  slots: [
    {
      name: 'default',
      single: false
    },
    {
      name: 'icons',
      label: '切换按钮图标', // TODO 属性编辑器也应该有预置，包括 icon
      single: true

    }
  ],

  render:  forwardRef((props, ref) => {
    const insRef = useRef<CarouselHandle>()

    useImperativeHandle(ref, () => {
      return {
        goto(index: number) {
          insRef.current?.goto({index}) // TODO 
        },

      }
    })



    return <Carousel
      ref={insRef}
      className={props.classNames}
      style={props.style}
      miniRender={props.minRender}
      currentIndex={props.currentIndex}
      moveSpeed={props.moveSpeed}
      timingFunc={props.timingFunc}
      animation={props.animation}
      direction={props.direction}
      indicatorPosition={props.indicatorPosition}
      indicatorType={props.indicatorType}
      showArrow={props.showArrow}
      trigger={props.trigger}
      arrowClassName={props.arrowClassName}
      autoPlay={props.autoPlay}
      indicatorClassName={props.indicatorClassName}
      onChange={props.onChange}

    >
      {props.children?.map(item => {
        return item
      })}
    </Carousel>
  })

}

export default CarouselDef