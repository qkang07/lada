import { CompDefBase, CompInstanceBase, CompSchemaBase, DefManager } from "./compDef";


export type CompEvent = {
  compId: string
  compIndex?: number // list 渲染的组件有 index
  payload?: any
}

/**
 * Binding Scope ， 即「绑定」的容器，容器内的组件在此处理绑定信息。
 * 这里相当于收集组件之间的依赖，给组件之间的绑定做路由。
 */
export class BindingScope {
  compMap: Map<string, CompInstanceBase> = new Map()

  // action 的map，用于当 event 触发时，找到对应的 action
  actionMap: Map<string, CompInstanceBase> = new Map()

  // prop 的 map，用于当 state 改变时，找到对应的 prop
  propMap: Map<string, CompInstanceBase> = new Map()

  constructor(public man: DefManager<CompDefBase>) {

  }

  regComp(comp: CompInstanceBase) {
    this.compMap.set(comp.id, comp)
  }

  triggerAction(compId: string ,actionName: string, event: CompEvent) {
    const comp = this.compMap.get(compId) 
    if(comp) {
      const action = comp.def.actions?.find(a => a.name === actionName)
      if(action) {
        // TODO 
      }
    } else {
      console.log('no such comp: ', compId)
    }
  }

  updateProp(compId: string, propName: string, value: any) {
    const comp = this.compMap.get(compId)
    if(comp) {
      const prop = comp.def.props?.find(p => p.name === propName)
      if(prop) {
        // TODO 
      }
    }

  }

  // 从 schema 开始构建。
  // 可能不需要？
  makeFromSchema(schema: CompSchemaBase) {
    
  }
}