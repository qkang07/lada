import { Optional, randomId } from "@/utils"
import { CompDefBase, CompSchemaBase } from "./compDef"
import { compMan } from "./manager"

export type HandlerShape = (payload?: any) => void
export type HandlerRegTable = Map<string, HandlerShape[]>
type HandlerType = 'others' | 'event' | 'action' | 'state' | 'prop'


// 这就是层代理，用于沟通 binding scope 和具体的组件实现
export class CompAgent<ST extends Record<string, any> = {}> {
  id: string

  state: ST

  def: CompDefBase

  private _mode: 'run' | 'design' = 'run'

  get mode() {
    return this._mode
  }

  constructor(public schema: CompSchemaBase){
    
    const def = compMan.getComp(schema.provider)
    if(def) {
      this.def = def
    } else {
      throw Error('no def found')
    }
    this.id = randomId()
    this.state = {} as ST
    // makeAutoObservable(this)
  }

  protected otherHandlers: HandlerRegTable = new Map()
  protected stateHandlers: HandlerRegTable = new Map()
  protected eventHandlers: HandlerRegTable = new Map()
  
  protected actionHandlers: HandlerRegTable = new Map()
  protected propHandlers: HandlerRegTable = new Map()


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


  // 向外传递
  onEvent(name: string, handler: HandlerShape){
    this.regHandler('event', name, handler)
  }

  onStateChange(name: string, handler: HandlerShape){
    this.regHandler('state', name, handler)
  }


  // 向内传递
  onPropChange(name: string, handler: HandlerShape){
    this.regHandler('prop', name, handler)
  }

  onActionCall(name: string, handler: HandlerShape){
    this.regHandler('action', name, handler)
  }
  

  
  // 向外传递
  offEvent(name: string, handler?: HandlerShape){
    this.unRegHandler('event', name, handler)
  }

  offStateChange(name: string, handler?: HandlerShape){
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
    list.forEach(h => h(payload))
  }


  // 组件改变了 state，向外通知
  updateState(s: Optional<ST>) {
    this.state = {
      ...this.state,
      ...s
    }
    Object.keys(s).forEach(k => {
      this.getHandlerList('state', k).forEach(h => h(s[k]))
    })
    this.getHandlerList('others', 'state').forEach(h => h(this.state))
  }


  // 向内的操作，即传达给所代理的组件。
  // 组件需要监听这些操作

  // 向内 调用组件的 action
  callAction(action: string, payload?: any) {
    this.getHandlerList('action', action).forEach(h => h(payload))
  }

  // 向内 更新组件的 prop
  updateProp(prop: string, value?: any) {
    this.getHandlerList('prop', prop).forEach(h => h(value))
  }

  toSchema() {
    
  }
}