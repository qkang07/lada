import { useState } from "react";
import { DataSource } from "../../../libs/core/Def";
import { action, makeAutoObservable } from "mobx";

const HTTPDataSource: DataSource.Def = {
  name: 'http',
  type: 'async',
  params: [
    {
      name: 'url',
      label :'URL',
      valueType: 'string',
      required: true
    },
    {
      name: 'method',
      valueType: 'string'
    },
    {
      name: 'query',
      valueType: 'string'
    },
    {
      name: 'body',
      valueType: 'any'
    }
  ],
  actions: [
    {
      name: 'run',
    }
  ],
  events: [
    {
      name: 'onSuccess',
    },
    {
      name: 'onError',
    }
  ],
  create(agent) {
    // const {url ,method = 'GET', body} = params

    const data = makeAutoObservable({
      value: undefined,
      loading: false
    })
   

    const run = action(async (params: any) => {
      data.loading = true
      agent.updateState({
        ...agent.state,
        loading: true
      })
      try {
        // TODO 暂时用 fetch
        const res = await fetch(params.url, params.options)
        const resData = await res.json()
        data.loading = false
        set(resData)
        return resData

      } catch(e) {
        data.loading = false
        return Promise.reject(e)
      }
    })

    const set = action((v: any) => {
      data.value = v
      agent.emitEvent('change', data.value)
      agent.updateState({
        data: data.value,
        loading: data.loading
      })
    })

    agent.onActionCall('run',(value) => {
      run(value)
    })
    agent.onActionCall('set',(value) => {
      set(value)
    })

    return () => ({
      loading: data.loading,
      data: data.value,
      run,
      setData: set
    })
  }
}

export default HTTPDataSource