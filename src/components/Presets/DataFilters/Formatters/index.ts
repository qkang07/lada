import { Formatter } from "@/libs/core/Def";


const Formatters: Formatter[] = [
  {
    name: 'toString',
    valueType: 'any',
    transformer(v) {
      if(v['toString']) {
        return v.toString()
      }
      return String(v)
    }
  },
  {
    name: 'toNum',
    valueType: 'string',
    transformer(v) {
      return Number(v)
    }
  }
]

export default Formatters