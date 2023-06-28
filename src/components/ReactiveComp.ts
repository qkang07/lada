import { Optional, randomId } from "@/utils"
import { makeAutoObservable } from "mobx"
import { CompDefBase, CompSchemaBase } from "./compDef"
import { uiMan } from "./manager"

export abstract class ReactiveComp<ST extends Record<string, any> = {}> {
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
    makeAutoObservable(this)
  }

  protected stateChangeCallback?: (stateName: string, value?: any) => any
  protected onPropChangeCallback?: () => any

  updateState(s: Optional<ST>) {
    this.state = {
      ...this.state,
      ...s
    }
    Object.keys(s).forEach(k => {
      this.stateChangeCallback?.(k, s[k])
    })
  }

  onStateChange(cb: (stateName: string, value: any) => any) {
    this.stateChangeCallback = cb
  }

  abstract onPropChange(propName: string, value: any) : any

  emitEvent(event: string ,payload: any) {

  }

  abstract onCallAction(action: string, payload: any): any

  toSchema() {
    
  }
}