import { randomId } from "@/utils";
import { CompAgent } from "./CompAgent";
import { BindingScope, CompDefBase, CompInstanceBase, CompSchemaBase } from "./Def";
import { ProviderManager } from "./ProviderManager";




export type CompEvent = {
  compId: string
  compIndex?: number // list 渲染的组件有 index
  payload?: any
}

/**
 * Binding Scope ， 即「绑定」的容器，容器内的组件在此处理绑定信息。
 * 这里相当于收集组件之间的依赖，给组件之间的绑定做路由。
 */
export class BindingContainer {
  compMap: Map<string, CompAgent> = new Map()

  schema: BindingScope.Schema

  bindingMap: Map<string, BindingScope.BindingInstance> = new Map()

  constructor(public man: ProviderManager<CompDefBase>, schema: BindingScope.Schema) {
    this.schema = schema
  }




  // 虽然设置绑定和设置 prop 默认值都影响组件的 prop，但是他们改动的地方是不同的，这里只更新绑定。
  // 删除绑定
  removeBinding(id: string) {
    const schema = this.unRegBinding(id)
    const schemaIndex = this.schema.bindings.findIndex(bd=>bd === schema)
    this.schema.bindings.splice(schemaIndex, 1)
  }

  // 添加绑定
  addBinding(bdSchema: BindingScope.BindingSchema) {
    this.regBinding(bdSchema)
    this.schema.bindings.push(bdSchema)
  }

  // 寻找某个组件的bindings，
  findCompBinding(compId: string) {
    return this.schema.bindings.filter(bd => {
      return bd.type === 'state' && bd.target.id === compId || bd.type === 'event' && bd.source.id === compId
    })
  }

  protected unRegBinding(id: string) {
    const bdIns = this.bindingMap.get(id)
    const schema = bdIns!.schema
    // 去掉旧的真实绑定
    const source = this.compMap.get(bdIns!.schema.source.id)
    if(schema.type === 'state') {
      source?.unBindState(schema.source.prop, bdIns?.handler)
    } else {
      source?.unBindEvent(schema.source.prop, bdIns?.handler)
    }
    this.bindingMap.delete(id)
    return schema
    
  }

  protected regBinding(schema: BindingScope.BindingSchema) {
    const source = this.compMap.get(schema.source.id)
    const target = this.compMap.get(schema.target.id)
    const handler = schema.type === 'state' ? (payload?: any) => {target?.updateProp(schema.target.prop, payload)} : (payload?: any) => {target?.callAction(schema.target.prop, payload)}
    if(schema.type === 'state') {
      source?.bindState(schema.source.prop, handler)
    } else {
      source?.bindEvent(schema.source.prop, handler)
    }
    const inst: BindingScope.BindingInstance = {
      id: randomId(),
      schema: schema,
      handler
    }
    this.schema.bindings.push(schema)
    this.bindingMap.set(inst.id, inst)
  }

  //
  // 因为组件是依次注册的，state-prop 绑定需要做两个考虑，
  // 找到已经注册的组件的 state，绑定当前的 prop
  // 找到已经注册的组件的 prop，绑定自己的 state
  regComp(comp: CompAgent) {

    this.compMap.set(comp.id, comp)
    // agent 自身是不会处理和其他组件的绑定关系的，只有在容器内才能处理。

    // step1: 处理 comp 自身的 state
    // agent 自行处理

    // step2: 将自己的 event 绑定给目标的 action
    const eventBindings = this.schema.bindings.filter(bd => bd.type === 'event' && bd.source.id === comp.id)
    eventBindings.forEach(bd => {
      const handler = (payload: any) => {
        this.triggerAction(bd.target.id, bd.target.prop, payload)
      }
      comp.bindEvent(bd.source.prop, handler)
      const inst: BindingScope.BindingInstance = {
        id: randomId(),
        schema: bd,
        handler
      }
      this.bindingMap.set(inst.id, inst)
    })
    

    // step3: 将自己的 action 绑定到调用方的 event
    // TODO 
    const actionBindings = this.schema.bindings.filter(bd => bd.type === 'event' && bd.target.id === comp.id)
    actionBindings.forEach(bd => {
      const source = this.compMap.get(bd.source.id)
      source?.bindEvent(bd.source.prop, payload => {

      })
    })

    // step4: 用自己的 state 更新和绑定目标的 prop
    const stateBindings = this.schema.bindings.filter(bd => bd.type === 'state' && bd.source.id === comp.id)
    stateBindings.forEach(bd => {
      // 初次注册，直接更新 state prop。
      this.updateProp(bd.target.id, bd.target.prop, comp.state[bd.source.prop]) // FUTURE 这里只用了第一层 state, 深层以后再考虑

      // 绑定 state change 事件
      comp.bindState(bd.source.prop, payload => {
        this.updateProp(bd.target.id, bd.target.prop, payload)
      })
    })

    // step5: 找到绑定的源头 state，更新自己的 prop
    const propBindings = this.schema.bindings.filter(bd => bd.type === 'state' && bd.target.id === comp.id)
    propBindings.forEach(bd => {
      const source = this.compMap.get(bd.source.id)
      if(source) {
        this.updateProp(comp.id, bd.target.prop, source.state[bd.source.prop])
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