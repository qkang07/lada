import { DataFilterSchema } from "@/libs/core/Def";
import Formatters from "./Formatters";

export const processFilter = (v: any, df: DataFilterSchema) => {
  if(df.type === 'format' && df.formatter) {
    const formatter = Formatters.find(f => f.name === df.formatter)
    if(formatter) {
      return formatter.transformer(v)
    }
  }

  if(typeof v === 'object' && v !== null) {

    if(df.type === 'child' && df.childPath?.length) {
      let t = v
      for(let i = 0;i < df.childPath.length; i++) {
        t = t?.[df.childPath[i]]
      }
      return t
    }
  
    if(df.type === 'objMap' && df.objMap) {
      let t: Record<string, any> = {}
      Object.keys(df.objMap).forEach(key => {
        const tkey = df.objMap![key]
        t[tkey] = v[key]
      })
      return t
    }
  }
  console.warn('unable to process filter: ', df.name)
  return v
}