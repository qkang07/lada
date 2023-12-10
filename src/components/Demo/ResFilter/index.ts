import { PureComp } from "@/libs/core/Def";

const ResFilter: PureComp.Def = {
  name: 'res-filter',
  states: [{
    name: 'output',
    valueType: 'string',
  }],
  props: [{
    name: 'input',
    valueType: 'any'
  }],
  onCreate(agent) {
    agent.onPropChange('input', (v: any)=>{
      agent.updateState({
        output: v.message
      })
    })
  }
}

export default ResFilter