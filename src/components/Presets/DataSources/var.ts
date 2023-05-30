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
  create({ctx}){
    const data = makeAutoObservable({
      value: undefined
    })

    const set = action((v: any) => {
      data.value = v
      ctx.emitEvent('change', data.value)
      ctx.setState({data: data.value})
    })

    ctx.onAction('set', (v: any) => {
      set(v)
    })
    

  }
}

export default VarDataSource