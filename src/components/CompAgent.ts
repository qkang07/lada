import { Optional, randomId } from "@/utils"
import { CompDefBase, CompSchemaBase } from "./compDef"
import { uiMan } from "./manager"

export type TriggerHandlerType = (name: string, payload?: any) => any

// 这就是层代理，用于沟通 binding scope 和具体的组件实现
export abstract class CompAgent<ST extends Record<string, any> = {}> {
  id: string

  state: ST

  def: CompDefBase

  constructor(public schema: CompSchemaBase){
    
    const def = uiMan.getComp(schema.provider)
    if(def) {
      this.def = def
    } else {
      throw Error('no def found')
    }
    this.id = randomId()
    this.state = {} as ST
    // makeAutoObservable(this)
  }

  protected stateChangeHandler?: TriggerHandlerType
  protected eventHandler?: TriggerHandlerType
  
  protected callActionHandler?: TriggerHandlerType
  protected propChangeHandler?: TriggerHandlerType


  // 向外传递
  onEvent(handler: TriggerHandlerType){
    this.eventHandler = handler
  }
  
  onStateChange(handler: TriggerHandlerType){
    this.stateChangeHandler = handler
  }
  
  // 向内传递
  onPropChange(handler: TriggerHandlerType) {
    this.propChangeHandler
  }
  onActionCall(handler: TriggerHandlerType) {
    this.callActionHandler = handler
  }


  // 向外的操作，即组件传达出来的动作。
  // binding scope 需要监听这些操作。

  // 组件发出了事件，向外通知
  emitEvent(event: string ,payload?: any) {
    this.eventHandler?.(event, payload)
  }


  // 组件改变了 state，向外通知
  updateState(s: Optional<ST>) {
    this.state = {
      ...this.state,
      ...s
    }
    Object.keys(s).forEach(k => {
      this.stateChangeHandler?.(k, s[k])
    })
  }


  // 向内的操作，即传达给所代理的组件。
  // 组件需要监听这些操作

  // 向内 调用组件的 action
  callAction(action: string, payload?: any) {
    this.callActionHandler?.(action, payload)
  }

  // 向内 更新组件的 prop
  updateProp(prop: string, value?: any) {
    this.propChangeHandler?.(prop, value)
  }


  toSchema() {
    
  }
}