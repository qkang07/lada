import DataSources from "@/components/Designer/DataSource";
import { CompAgent } from "./CompAgent";
import { CompDefBase, DataSource } from "./Def";
import { BindingContainer } from "./BindingContainer";


const DataSourceBaseDef: CompDefBase = {
  name: '', // 留白,
  events: [
    {
      name: 'onChange',
      valueType: 'any'
    },{
      name: 'onError'
    }
  ],
  props: [
    {
      name: 'defaultParams'
    },
    {
      name: 'timeout',
      valueType: 'number'
    },
    {
      name: 'debounceWait',
      valueType: 'number'
    }
  ],
  actions: [
    {
      name: 'load',
    },
    {
      name: 'cancel'
    },
    {
      name: 'mutate'
    }
  ],
  states: [
    {
      name: 'loading',
      valueType: 'boolean'
    },{
      name: 'data',
      valueType: 'any'
    }
  ]
}


class DataSourceAgent<S extends DataSource.Schema = DataSource.Schema, D extends DataSource.Def = DataSource.Def> extends CompAgent<S, D> {
  constructor(schema:S, container?: BindingContainer){
    super(schema, container)
  }

  // 呼唤调用
  onCallFetch(cb: (params?: any) => any) {

  }

  // 输出结果
  emitChange(data?: any) {

  }

  emitError(err?: any) {

  }

  
}