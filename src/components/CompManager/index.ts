import { DataSourceRegTable, UICompRegTable } from "./RegList"
import { compMan } from "./manager"

export const initCompMan = () => {
  

  UICompRegTable.forEach(cat => {
    cat.items.forEach(item => {
      compMan.regComp(item)
    })
  })

  DataSourceRegTable.forEach(cat => {
    cat.items.forEach(item => {
      compMan.regComp(item)
    })
  })


}