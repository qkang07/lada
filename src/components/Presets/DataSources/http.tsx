import { useState } from "react";
import { CompDefBase, PureComp, UIComp } from "../../../libs/core/Def";
import { action, makeAutoObservable } from "mobx";
import { Form, Input, Select } from "@arco-design/web-react";

type HttpProps = {
  timeout?: number
  url?: string
  params?: any
  headers?: Record<string, string>
  method?: string
}

const HTTPDataSource: PureComp.Def<HttpProps> = {
  name: 'http',
  label: 'HTTP 请求数据',
  // type: 'async',
  events: [
    {
      name: 'change',
      label: '数据更改事件',
      valueType: 'any'
    },{
      name: 'error',
      label: '数据错误事件'
    }
  ],
  props: [
    {
      name: 'url',
      valueType: 'string',
      label: 'URL',
      defaultValue: 'http://localhost:8080',
      editor: {type: 'textarea'}
    },
    {
      name: 'method',
      valueType: 'string',
      label: '请求方式',
      defaultValue: 'GET',
      editor: {type: 'select', options: ['GET','POST','PUT','DELETE','HEAD']}
    },
    {
      name: 'defaultParams',
      valueType: 'any',
      label: '默认参数',
      editor: {type: 'string'}
    },
    {
      name: 'timeout',
      label: '超时时间',
      valueType: 'number',
      editor: {type:'number'}
    },
    {
      name: 'debounceWait',
      label: '防抖时间',
      valueType: 'number',
      editor: {type: 'number'}
    },
    {
      name: 'autorun',
      label: '立即执行',
      valueType: 'boolean',
      editor: {type: 'boolean'}
    }
  ],
  actions: [
    {
      name: 'fetchData',
      label: '请求数据'
    },
    {
      name: 'cancel',
      label: '取消请求'
    },
    {
      name: 'setData',
      label: '更改数据'
    }
  ],
  states: [
    {
      name: 'loading',
      valueType: 'boolean',
      label: '是否在请求中'
    },{
      name: 'data',
      valueType: 'any',
      label: '数据'
    }
  ],
  onSchemaCreate(schema) {
    return schema
  },
  onCreate(agent) {
    // const {url ,method = 'GET', body} = params
    const props = agent.schema.defaultProps
    const data: any = makeAutoObservable({
      ...props,
      value: undefined,
      loading: false,
      cancelFlag: false
    })

    const checkCancel = () => {
      if(data.cancelFlag) {
        data.cancelFlag = false
        data.loading = false
        return true
      }
    }
   

    const fetchData = action(async (params: any) => {
      data.params = params
      data.loading = true

      agent.updateState({
        ...agent.state,
        ...data,
        loading: true
      })
      try {

        // TODO 暂时用 fetch
        const res = await fetch(data.url, {
          method: data.method,
          body: JSON.stringify(data.params),
        })
        if(checkCancel()) {
          return Promise.reject('cancelled')
        }
        const resData = await res.json()

        data.loading = false
        setData(resData)
        return resData

      } catch(e) {
        if(checkCancel()) {
          return Promise.reject('cancelled')
        }
        data.loading = false
        agent.emitEvent('error', e)
        return Promise.reject(e)
      }
    })

    const setData = action((v: any) => {
      data.value = v
      agent.emitEvent('change', data.value)
      agent.updateState({
        data: data.value,
        loading: data.loading
      })
    })

    agent.onActionCall('fetchData',(params: any) => {
      fetchData(params)
    })
    agent.onActionCall('setData',(value) => {
      setData(value)
    })
    agent.onActionCall('cancel', () => {
      data.cancelFlag = true
    })

    agent.onPropChange('url', (newUrl: string) => {
      data.url = newUrl
    })

    agent.onPropChange('params', (params: any) => {
      data.params = params
    })

    // init 
    if(data.url && data.autorun) {
      fetchData(data.params)
    } 

    return () => ({
      loading: data.loading,
      data: data.value,
      fetchData,
      setData
    })
  },

  // render(props) {
  //   const [form] = Form.useForm()
    
  //   return <div>
  //     <Form form={form}>
  //       <Form.Item label={'URL'} field={'url'}>
  //         <Input/>
  //       </Form.Item>
  //       <Form.Item label={'Method'} field={'method'}>
  //         <Select>
  //           <Select.Option value={'GET'}>GET</Select.Option>
  //           <Select.Option value={'POST'}>POST</Select.Option>
  //           <Select.Option value={'PUT'}>PUT</Select.Option>
  //           <Select.Option value={'DELETE'}>DELETE</Select.Option>
  //         </Select>
  //       </Form.Item>
  //       <Form.Item label={'Data'} field={'data'}>

  //       </Form.Item>
  //     </Form>
  //   </div>
  // }
}

export default HTTPDataSource