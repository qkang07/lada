import { DataProviderDef } from "../compDef";

const VarDataProvider: DataProviderDef = {
  name: 'var',
  type: 'var',
  actions:[
    {
      name: 'set',
      params: 'any',
      handler() {}
    }
  ],
  events: [
    {
      name: 'onChange',
      params: 'any'
    }
  ],
  use() {

  }
}