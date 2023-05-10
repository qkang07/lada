import { action, makeAutoObservable } from "mobx";
import { DataSourceDef } from "../compDef";

const VarDataSource: DataSourceDef = {
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
  create(ctx) {
    const data = makeAutoObservable({
      value: undefined
    })

    return {
      set: action((v: any) => {
        data.value = v
      }),
      data: data.value,
    }
  }
}

export default VarDataSource