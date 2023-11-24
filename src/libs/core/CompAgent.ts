import { Optional, randomId } from "../../utils"
import { BindingInfo, CompDefBase, CompSchemaBase, UIComp } from "./Def"
import { compMan } from "../../components/CompManager/manager"
import { makeAutoObservable } from "mobx"

export type HandlerShape = (payload?: any) => void

export type HandlerRegTable = Map<string, HandlerShape[]>

export interface BindingRegInfo extends BindingInfo {
  // schema id
  // type: 'action' | 'prop'
  handler: HandlerShape
}

type HandlerType = 'others' | 'event' | 'action' | 'state' | 'prop'

// export type BindingRegTable = Map<string, BindingTarget>


// 这就是层代理，用于沟通 binding scope 和具体的组件实现

export class CompAgent<S extends CompSchemaBase = CompSchemaBase, D extends CompDefBase = CompDefBase, ST extends Record<string, any> = Record<string, any>> {
  id: string

  state: ST

  def: D

  schema: S

  parentAgent?: typeof this

  parentSlot?: UIComp.SlotSchema

  instance?: any

  flagDom?: HTMLElement

  constructor(schema: S){
    this.schema = schema
    const def = compMan.getComp(schema.provider)
    if(def) {
      this.def = def as D
    } else {
      throw Error('no def found')
    }
    this.id = randomId()
    this.state = {} as ST
    this.instance = def.onCreate?.(this)
  }

  

  // 组件上所拥有的 binding，用于设计时
  // propBindings: BindingScope.BindingInstance[] = []
  // actionBindings: BindingScope.BindingInstance[] = []

  protected otherHandlers: HandlerRegTable = new Map()

  protected stateHandlers: HandlerRegTable = new Map()
  protected eventHandlers: HandlerRegTable = new Map()
  
  protected actionHandlers: HandlerRegTable = new Map()
  protected propHandlers: HandlerRegTable = new Map()

  protected log(name: string, ...args: any[]) {
    console.log(name, this.schema.name, ...args)
  }

  destroy() {
    // this.schema = undefined
    this.parentAgent = undefined
    this.instance = undefined
    this.parentSlot = undefined
    this.otherHandlers.clear()
    this.stateHandlers.clear()
    this.eventHandlers.clear()
    this.actionHandlers.clear()
    this.propHandlers.clear()
  }

  protected getHandlerList( type: HandlerType, name: string) {
    const regTable = {
      others: this.otherHandlers,
      event: this.eventHandlers,
      action: this.actionHandlers,
      state: this.stateHandlers,
      prop: this.propHandlers
    }[type]
    let list = regTable.get(name)
    if(!list) {
      list = []
      regTable.set(name, list)
    }
    return list
  }

  protected regHandler(type: HandlerType, name: string, handler: HandlerShape) {
    const list = this.getHandlerList(type, name)
    // debugger
    if(list.indexOf(handler) < 0) {
      list.push(handler)
    }
  }

  protected unRegHandler(type: HandlerType, name: string, hander?: HandlerShape) {
    const list = this.getHandlerList(type, name)
    if(hander) {
      const index = list.indexOf(hander)
      if(index >= 0) {
        list.splice(index, 1)
      }
    } else {
      list.splice(0)
    }
  }

  // 设计时 查找组件 dom
  findDom() {
    if(!this.flagDom) {
      return undefined
    }
    return this.flagDom.nextElementSibling as HTMLElement
  }


  // 向外传递
  // 给自己的 event 绑定 handler
  bindEvent(name: string, handler: HandlerShape){
    this.log('bind event', name)
    this.regHandler('event', name, handler)
    // debugger
  }

  // 给自己的 state 绑定 handler
  bindState(name: string, handler: HandlerShape){
    this.log('bind state', name)
    // debugger
    this.regHandler('state', name, handler)
  }


  // 向内传递
  onPropChange(name: string, handler: HandlerShape){
    this.log('onprop', name)
    this.regHandler('prop', name, handler)
  }

  onActionCall(name: string, handler: HandlerShape){
    this.log('onaction', name)
    this.regHandler('action', name, handler)
  }
  

  
  // 向外传递
  unBindEvent(name: string, handler?: HandlerShape){
    this.unRegHandler('event', name, handler)
  }

  unBindState(name: string, handler?: HandlerShape){
    this.unRegHandler('state', name, handler)
  }


  // 向内传递
  offPropChange(name: string, handler?: HandlerShape){
    this.unRegHandler('prop', name, handler)
  }

  offActionCall(name: string, handler?: HandlerShape){
    this.unRegHandler('action', name, handler)
  }


  // 向外的操作，即组件传达出来的动作。
  // binding scope 需要监听这些操作。

  // 组件发出了事件，向外通知
  emitEvent(event: string ,payload?: any) {
    const list = this.getHandlerList('event', event)
    this.log('emit event', event, payload, list)
    list.forEach(h => h(payload))
  }

  // 组件改变了 state
  updateState(s: Optional<ST>) {
    this.state = {
      ...this.state,
      ...s
    }
    Object.keys(s).forEach(k => {
      const list = this.getHandlerList('state', k)
      console.log('update state', k, s[k], list)
      list.forEach(h => h(s[k]))
    })
    // this.getHandlerList('others', 'state').forEach(h => h(this.state))
  }


  // 向内的操作，即传达给所代理的组件。
  // 组件需要监听这些操作

  // 向内 调用组件的 action
  callAction(action: string, payload?: any) {
    // console.log('call action', action, payload)
    if(this.def.actions?.some(a => a.name === action)) {
      const list = this.getHandlerList('action', action)
      this.log('call action', action, payload, list)
      list.forEach(h => h(payload))
    }
  }

  // 向内 更新组件的 prop
  updateProp(prop: string, value?: any) {
    if(this.def.props?.some(p => p.name === prop)) {
      const list = this.getHandlerList('prop', prop)
      this.log('update prop', prop, value, list)
      list.forEach(h => h(value))
    }
  }


  // 设计时

  updateDefaultProp(propName: string, value?: any) {
    if(!this.schema.defaultProps){
      this.schema.defaultProps = {}
    }
    this.schema.defaultProps[propName] = value
    // this.schema.defaultProps = {...this.schema.defaultProps}
    this.getHandlerList('others', 'schemaChange').forEach(h => {
      h(this.schema)
    })
  }

  onSchemaChange(cb: (schema: CompSchemaBase) => void) {
    this.regHandler('others', 'schemaChange', cb)
  }
  // 设计时更新 schema
  updateSchema(schema?: S) {
    if(schema) {
      this.schema = schema
    }
    this.getHandlerList('others', 'schemaChange').forEach(h => {
      h()
    })
  }

}