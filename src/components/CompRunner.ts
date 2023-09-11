import { BindingContainer } from "@/libs/core/BindingContainer";
import { CompAgent } from "@/libs/core/CompAgent";
import { CompSchemaBase } from "@/libs/core/Def";


// 没有 render 只有 create 的组件类型
export const CompRunner = (schema: CompSchemaBase, bdCon?: BindingContainer) => {
  const agent = new CompAgent(schema)
  const instance = agent.instance
  if(instance) {
    agent.def.actions?.forEach(action => {
      agent.onActionCall(action.name, (params) => {
        instance[action.name](params)
      })
    })
  }
}