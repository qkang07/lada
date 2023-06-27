import { CompDefBase, CompInstanceBase, CompSchemaBase, DefManager } from "./compDef";

/**
 * Binding Scope ， 即「绑定」的容器，容器内的组件在此处理绑定信息。
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

  triggerAction(id: string ,action: string) {

  }

  updateProp(id: string, prop: string, value: any) {
    const comp = this.compMap.get(id)

  }

  makeFromSchema(schema: CompSchemaBase) {
    
  }
}