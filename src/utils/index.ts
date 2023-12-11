import { OptionType, TextType } from "@/libs/core/Def";
import { customAlphabet } from "nanoid";


// 纯粹的 nanoid 会带有 - _ 等字符可能带来问题
const alphabet = '1234567890qwertyuiopasdfghjklzxcvbnm';
export const randomId = customAlphabet(alphabet, 15);



export type Optional<T extends Record<string, any>> = {
  [P in keyof T]?: T[P];
};

export const isEmpty = (v: any) => {
  return v === undefined || v === null || isNaN(v)
}

export const firstAvailable = (...items: any[]) => {
  while(items.length) {
    const v = items.shift()
    if(isEmpty(v)) {
      continue
    } else {
      return v
    }
  }
  return undefined
}


export function nrmlzOptions(options:(TextType | OptionType)[]) {
  if(!options || !(options instanceof Array)) {
    console.warn('invalid options value!', options)
    return []
  }
  console.log(options)
  return options.map(item => {
    if(typeof item === 'object' && Reflect.has(item, 'value')) {
      const oitem = item as {value: TextType, label?: string}
      return {
        value: oitem.value,
        label: String(oitem.label || oitem.value)
      }
    }
    return {value: item as TextType, label: String(item)}

  })
}