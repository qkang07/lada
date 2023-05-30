import { useState } from "react";
import { DataSource } from "../../compDef";
import { action, makeAutoObservable } from "mobx";

const HTTPDataSource: DataSource.Def = {
  name: 'http',
  type: 'async',
  params: [
    {
      name: 'url',
      label :'URL',
      type: 'string',
      required: true
    },
    {
      name: 'method',
      type: 'string'
    },
    {
      name: 'query',
      type: 'string'
    },
    {
      name: 'body',
      type: 'any'
    }
  ],
  actions: [
    {
      name: 'run',
      params: 'params',
    }
  ],
  events: [
    {
      name: 'onSuccess',
      params: 'result'
    },
    {
      name: 'onError',
      params: 'error'
    }
  ],
  create({ctx}) {
    // const {url ,method = 'GET', body} = params

    const data = makeAutoObservable({
      value: undefined,
      loading: false
    })
   

    const run = action(async (params: any) => {
      data.loading = true
      ctx.setState({
        ...ctx.state,
        loading: true
      })
      try {
        const res = await  fetch(params.url, params.options)
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
      ctx.emitEvent('change', data.value)
      ctx.setState({
        data: data.value,
        loading: data.loading
      })
    })

    ctx.onAction('run', run)
    ctx.onAction('set', set)
    

    return () => ({
      loading: data.loading,
      data: data.value,
      run,
      setData: set
    })
  }
}

export default HTTPDataSource