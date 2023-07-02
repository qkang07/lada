import { action, makeAutoObservable } from "mobx";
import { DataSource } from "../../compDef";

const VarDataSource: DataSource.Def = {
  name: 'var',
  type: 'var',
  actions:[
    {
      name: 'set',
      params: 'any',
    }
  ],
  events: [
    {
      name: 'change',
      params: 'any'
    }
  ],
  create(agent){
    const data = makeAutoObservable({
      value: undefined
    })

    const set = action((v: any) => {
      data.value = v
      agent.updateState({data: data.value})
      agent.emitEvent('change', data.value)
    })
    agent.onActionCall((name, value) => {
      if(name === 'set') {
        set(value)
      }
    })

  }
}

export default VarDataSource