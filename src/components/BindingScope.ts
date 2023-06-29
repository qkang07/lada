import { CompAgent } from "./CompAgent";
import { BindingScope, CompDefBase, CompInstanceBase, CompSchemaBase, DefManager } from "./compDef";


export type CompEvent = {
  compId: string
  compIndex?: number // list 渲染的组件有 index
  payload?: any
}

/**
 * Binding Scope ， 即「绑定」的容器，容器内的组件在此处理绑定信息。
 * 这里相当于收集组件之间的依赖，给组件之间的绑定做路由。
 */
export class BindingScopeContainer {
  compMap: Map<string, CompAgent> = new Map()

  schema: BindingScope.Schema

  constructor(public man: DefManager<CompDefBase>, schema: BindingScope.Schema) {
    this.schema = schema
  }

  regComp(comp: CompAgent) {
    this.compMap.set(comp.id, comp)
    // TODO 目前还是列表查找的方式。后面可以直接做成引用
    comp.onEvent((event, payload) => {
      const bindings = this.schema.bindings.filter(bd => {
        bd.type === 'action' && bd.source.id === comp.id && bd.source.prop === event
      })
      if(bindings.length) {
        bindings.forEach(bd => {
          this.triggerAction(bd.target.id, bd.target.prop, payload)
        })
      }
    })
    comp.onStateChange((state, value) => {
      const bindings = this.schema.bindings.filter(bd => {
        bd.type === 'state' && bd.source.id === comp.id && bd.source.prop === state
      })
      if(bindings.length) {
        bindings.forEach(bd => {
          this.updateProp(bd.target.id, bd.target.prop, value)
        })
      }
    })
  }

  triggerAction(compId: string ,actionName: string, payload?: any) {
    const comp = this.compMap.get(compId) 
    if(comp) {
      const action = comp.def.actions?.find(a => a.name === actionName)
      if(action) {
        comp.callAction(actionName, payload)
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
        comp.updateProp(propName, value)
      }
    }
  }

  // 从 schema 开始构建。
  // 可能不需要？
  makeFromSchema(schema: CompSchemaBase) {
    
  }
}