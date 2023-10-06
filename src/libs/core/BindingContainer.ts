import { bind, isEqual, takeRight } from 'lodash-es';
import { randomId } from "@/utils";
import { CompAgent } from "./CompAgent";
import { BindingInfo, BindingInstance, BindingSchema, BindingScopeSchema, CompDefBase, CompSchemaBase } from "./Def";
import { ProviderManager } from "./ProviderManager";




export type CompEvent = {
  compId: string
  compIndex?: number // list 渲染的组件有 index
  payload?: any
}

export type ContainerOptions = {
  // 设计时的容器不会处理绑定，只会在 schema 记录
  isDesign?: boolean
}

/**
 * Binding Scope ， 即「绑定」的容器，容器内的组件在此处理绑定信息。
 * 这里相当于收集组件之间的依赖，给组件之间的绑定做路由。
 */
export class BindingContainer {
  compMap: Map<string, CompAgent> = new Map()

  schemaCompMap: Map<string, CompAgent> = new Map()

  schema: BindingScopeSchema

  // bindingMap: Map<string, BindingInstance> = new Map()
  bindingInstanceList: BindingInstance[] =[]

  contextCompAgents: CompAgent[] = []

  protected options: ContainerOptions = {}

  constructor(schema: BindingScopeSchema, options?: ContainerOptions) {
    this.schema = schema
    this.options = Object.assign(this.options, options)

    schema.normalComps.forEach(compSchema =>{
      const agent = new CompAgent(compSchema, this)
      this.contextCompAgents.push(agent)
      this.regComp(agent)
    })
  }


  // 删除绑定。设计时使用，只更新 schema 不实例化
  removeBinding(bdSchema: BindingSchema) {
    // const schema = this.unRegBinding(id)
    const schemaIndex = this.schema.bindings.findIndex(bd=> isEqual(bd, bdSchema) )
    this.schema.bindings.splice(schemaIndex, 1)
  }

  // 添加绑定。设计时使用，只更新 schema 不实例化
  addBinding(bdSchema: BindingSchema) {
    // this.regBinding(bdSchema)
    // console.log('add binding', bdSchema)
    this.schema.bindings.push(bdSchema)
    if(!this.schema.bindings.find(bd => isEqual(bd, bdSchema))) {
      this.schema.bindings.push(bdSchema)
    }
    
  }

  // 寻找某个组件的bindings，
  findCompBinding(compId: string) {
    return this.schema.bindings.filter(bd => {
      return bd.type === 'state-prop' && bd.target.id === compId || bd.type === 'event-action' && bd.source.id === compId
    })
  }

  // protected unRegBinding(id: string) {
  //   const bdIns = this.bindingMap.get(id)
  //   const schema = bdIns!.schema
  //   // 去掉旧的真实绑定
  //   const source = this.compMap.get(bdIns!.schema.source.id)
  //   if(schema.type === 'state') {
  //     source?.unBindState(schema.source.prop, bdIns?.handler)
  //   } else {
  //     source?.unBindEvent(schema.source.prop, bdIns?.handler)
  //   }
  //   this.bindingMap.delete(id)
  //   return schema
    
  // }

  // protected regBinding(schema: BindingSchema) {
  //   const source = this.compMap.get(schema.source.id)
  //   const target = this.compMap.get(schema.target.id)
  //   const handler = schema.type === 'state' ? (payload?: any) => {target?.updateProp(schema.target.prop, payload)} : (payload?: any) => {target?.callAction(schema.target.prop, payload)}
  //   if(schema.type === 'state') {
  //     source?.bindState(schema.source.prop, handler)
  //   } else {
  //     source?.bindEvent(schema.source.prop, handler)
  //   }
  //   const inst: BindingInstance = {
  //     id: randomId(),
  //     schema: schema,
  //     handler
  //   }
  //   this.schema.bindings.push(schema)
  //   this.bindingMap.set(inst.id, inst)
  // }

  //
  // 因为组件是依次注册的，state-prop 绑定需要做两个考虑，
  // 找到已经注册的组件的 state，绑定当前的 prop
  // 找到已经注册的组件的 prop，绑定自己的 state
  regComp(comp: CompAgent) {
    // console.log('reg comp', comp.schema.name, comp)
    this.compMap.set(comp.id, comp)
    this.schemaCompMap.set(comp.schema.id, comp)

    // 非设计时，需要实例化绑定。
    if(!this.options.isDesign) {
      this.bindOneComp(comp)
    }
  }

  // 组件注销
  unRegComp(comp: CompAgent) {
    this.compMap.delete(comp.id)
    this.schemaCompMap.delete(comp.schema.id)

    // 非设计时，需要实例化绑定。
    if(!this.options.isDesign) {
      this.unBindOneComp(comp)
    }

  }

  // 将一个组件的绑定实例化
  // 要考虑这个组件是运行时
  bindOneComp(comp: CompAgent) {
    const schema = comp.schema
    // agent 自身是不会处理和其他组件的绑定关系的，只有在容器内才能处理。
    // 只用考虑绑定 source 的处理，因为只有 source 是主动的，target 是被动接收方，即使没有 target，source 也可以发出动作。


    const bindings = this.schema.bindings.filter(bd => bd.source.id === schema.id)

    // console.log('bind one comp', bindings)
    bindings.forEach(bd => {
      if(bd.type === 'event-action') {
        const handler = (payload: any) => {
          console.log('trigger action', bd, payload)
          this.triggerAction(bd.target, payload)
        }
        comp.bindEvent(bd.source.prop, handler)
        this.bindingInstanceList.push({
          schema: bd,
          handler
        })
      } else if(bd.type === 'state-prop') {
        this.updateProp(bd.target, comp.state[bd.source.prop])
        const handler = (payload: any) => {
          console.log('update prop', bd, payload)
          this.updateProp(bd.target, payload)
        }
        // 绑定 state change 事件
        comp.bindState(bd.source.prop, handler)
        this.bindingInstanceList.push({
          schema: bd, handler
        })
      }
    })

    // step1: 处理 comp 自身的 state
    // agent 自行处理

    // step2: 将自己的 event 绑定给目标的 action
    // const eventBindings = this.schema.bindings.filter(bd => bd.type === 'event' && bd.source.id === schema.id)
    // eventBindings.forEach(bd => {
    //   const handler = (payload: any) => {
    //     this.triggerAction(bd.target.id, bd.target.prop, payload)
    //   }
    //   this.bindingInstanceList.push({
    //     schema: bd,
    //     handler
    //   })
    //   comp.bindEvent(bd.source.prop, handler)
    // })
    

    // step3: 将自己的 action 绑定到调用方的 event
    // 这步也可以不用做，因为上一步已经无视 target 是否存在绑定 target action 。
    // const actionBindings = this.schema.bindings.filter(bd => bd.type === 'event' && bd.target.id === schema.id)
    // actionBindings.forEach(bd => {
    //   const source = this.compMap.get(bd.source.id)
    //   const handler = (payload: any) => {
    //     comp.callAction(bd.target.prop, payload)
    //   }
    //   source?.bindEvent(bd.source.prop, handler)
    //   this.bindingInstanceList.push({
    //     schema: bd,
    //     handler
    //   })
    // })

    // step4: 用自己的 state 更新和绑定目标的 prop
    // const stateBindings = this.schema.bindings.filter(bd => bd.type === 'state' && bd.source.id === schema.id)
    // stateBindings.forEach(bd => {
    //   // 即使 target 不存在，也可以注册 handler。
    //   // 初次注册，直接更新 state prop。
    //   this.updateProp(bd.target, comp.state[bd.source.prop])
    //   const handler = (payload: any) => {
    //     this.updateProp(bd.target, payload)
    //   }
    //   // 绑定 state change 事件
    //   comp.bindState(bd.source.prop, handler)
    //   this.bindingInstanceList.push({
    //     schema: bd, handler
    //   })
    // })

    // step5: 找到绑定的源头 state，更新自己的 prop
    // 这步可以省略，因为上一步绑定 target prop 的时候无视 target 是否存在。
  }

  // 将一个组件解绑，不再发出事件和 state 更新。
  // 想要不接收事件，需要把自己从 compMap 中移除。
  unBindOneComp(comp: CompAgent) {
    const schema = comp.schema

    const bindings = this.bindingInstanceList.filter(bd => bd.schema.source.id === schema.id)
    bindings.forEach(bd => {
      if(bd.schema.type === 'event-action') {
        comp.unBindEvent(bd.schema.source.prop, bd.handler)
      } else if(bd.schema.type === 'state-prop') {
        comp.unBindState(bd.schema.source.prop, bd.handler)
      }
    })

    // const eventBindings = this.schema.bindings.filter(bd => bd.type === 'event' && bd.source.id === schema.id)
    // // 解绑自己的事件
    // eventBindings.forEach(bd => {
    //   const bdInst = this.bindingInstanceList.find(bdi => isEqual(bdi.schema, bd))
    //   if(bdInst) {
    //     comp.unBindEvent(bd.source.prop, bdInst.handler)
    //   } else {
    //     console.log('大事不妙')
    //   }
    // })
    // // 解绑自己的 action
    // // const actionBindings = this.schema.bindings.filter(bd => bd.type === 'event' && bd.target.id === schema.id)
    // // actionBindings.forEach(bd => {
    // //   const source = this.compMap.get(bd.source.id)
    // //   source?.bindEvent(bd.source.prop, payload => {
    // //     // todo
    // //   })
    // // })
    // // 解绑自己的 state
    // const stateBindings = this.schema.bindings.filter(bd => bd.type === 'state' && bd.source.id === schema.id)
    // stateBindings.forEach(bd => {
    //   comp.unBindState(bd.source.prop)
    // })
    // // 解绑自己的 prop
    // const propBindings = this.schema.bindings.filter(bd => bd.type === 'state' && bd.target.id === schema.id)
    // propBindings.forEach(bd => {
    //   const source = this.compMap.get(bd.source.id)
    //   if(source) {
    //     source.unBindState(bd.source.prop, )
    //     this.updateProp(comp.id, bd.target.prop, source.state[bd.source.prop])
    //   }
    // })
  }

  // 将所有绑定都绑上
  bindAll() {

  }



  triggerAction(targetInfo: BindingInfo, payload?: any) {
    const {id, prop} = targetInfo
    const comp = this.schemaCompMap.get(id) 
    console.log('con.triggerAction', targetInfo, payload)
    if(comp) {
      comp.callAction(prop, payload)
    } else {
      console.log('no such comp for action call: ', id)
    }
  }

  updateProp(targetInfo: BindingInfo, value: any) {
    const {id, prop} = targetInfo
    const comp = this.schemaCompMap.get(id)
    if(comp) {
      comp.updateProp(prop, value)
    } else {
      console.log('no such comp for prop update: ', targetInfo)
    }
  }

  // 从 schema 开始构建。
  // 可能不需要？
  makeFromSchema(schema: CompSchemaBase) {
    
  }
}