import { useState } from "react";
import { DataProviderDef } from "../compDef";

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
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState<any>()
   

    const run = (params: any) => {
      setLoading(true)
      return fetch(params.url, params.options).then(res => {
        setLoading(false)
        return res.json().then(d => {
          setData(d)
          return d
        })
      })
    }

    return {
      loading,
      data,
      run
    }
  }
}

export default HTTPDataProvider