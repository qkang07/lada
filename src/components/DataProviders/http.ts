import { useState } from "react";
import { DataProviderDef } from "../compDef";
import { action, makeAutoObservable } from "mobx";

const HTTPDataProvider: DataProviderDef = {
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
      handler() {

      }
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
  use: (params: any) => {
    // const {url ,method = 'GET', body} = params

    const data = makeAutoObservable({
      value: undefined,
      loading: false
    })
   

    const run = action(async (params: any) => {
      data.loading = true
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

    const set = action((data: any) => {
      data.value = data
    })

    return {
      loading: data.loading,
      data: data.value,
      run,
      set
    }
  }
}

export default HTTPDataProvider