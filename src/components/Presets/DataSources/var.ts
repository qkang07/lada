import { action, makeAutoObservable } from "mobx";
import { UIComp } from "../../../libs/core/Def";

type VarProps = {
  value?: any
  
}


const VarDataSource: UIComp.Def<VarProps> = {
  name: 'var',
  label: '变量',
  actions:[
    {
      name: 'setData',
      label: '设置值'
    }
  ],
  events: [
    {
      name: 'change',
      label: '数据更改事件'
    }
  ],
  props: [
    {
      name: 'valueType',
      label: '数据类型',
      valueType: 'string',
      editor: {
        type: 'select',
        options: ['string','number','boolean']
      }
    }
  ],
  
  onCreate(agent){
    const data = makeAutoObservable({
      value: undefined
    })

    const setData = action((v: any) => {
      data.value = v
      agent.updateState({data: data.value})
      agent.emitEvent('change', data.value)
    })
    agent.onActionCall('setData',(value) => {
      setData(value)
    })

    return {
      setData
    }

  }
}

export default VarDataSource