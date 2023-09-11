import { useState } from "react";
import { UIComp } from "../../../libs/core/Def";
import { action, makeAutoObservable } from "mobx";
import { Form, Input, Select } from "@arco-design/web-react";

type HttpProps = {
  timeout?: number
  url?: string
  params?: any
  headers?: Record<string, string>
  method?: string
}

const HTTPDataSource: UIComp.Def<HttpProps> = {
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
      name: 'defaultParams',
      valueType: 'any',
      label: '默认参数'
    },
    {
      name: 'timeout',
      label: '超时时间',
      valueType: 'number'
    },
    {
      name: 'debounceWait',
      label: '防抖时间',
      valueType: 'number'
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
  create(agent) {
    // const {url ,method = 'GET', body} = params

    const data = makeAutoObservable({
      url: '',
      params: undefined as any,
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
        params,
        loading: true
      })
      agent.updateState({
        ...agent.state,
        loading: true
      })
      try {

        // TODO 暂时用 fetch
        const res = await fetch(params.url, params.options)
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

    return () => ({
      loading: data.loading,
      data: data.value,
      fetchData,
      setData
    })
  },

  render(props) {
    const [form] = Form.useForm()

    
    
    return <div>
      <Form form={form}>
        <Form.Item label={'URL'} field={'url'}>
          <Input/>
        </Form.Item>
        <Form.Item label={'Method'} field={'method'}>
          <Select>
            <Select.Option value={'GET'}>GET</Select.Option>
            <Select.Option value={'POST'}>POST</Select.Option>
            <Select.Option value={'PUT'}>PUT</Select.Option>
            <Select.Option value={'DELETE'}>DELETE</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label={'Data'} field={'data'}>

        </Form.Item>
      </Form>
    </div>
  }
}

export default HTTPDataSource