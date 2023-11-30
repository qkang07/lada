import { CompDefBase } from "./Def";


const extend2Defs = () =>{

}

export const extendDefs = <T extends Record<string, any> = Record<string, any>>(...defs: T[]) => {
  if(!defs.length) {
    return undefined
  }
  const base = defs.shift()! as Record<string, any>
  
  while(defs.length ) {
    const def = defs.shift()!
    Object.keys(base).forEach(key => {
      if(def[key] !== undefined) {

        if(base[key] instanceof Array) {
          base[key].push(...def[key])
        } else {
          base[key] = def[key]
        }
      }
    })
  }
  return base as T
}