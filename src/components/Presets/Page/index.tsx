import { CompDefBase } from "@/libs/core/Def";



const PageDef: CompDefBase = {

  name:'page',
  desc: '页面',
  actions: [
    {
      name: 'reload',
      desc: '刷新页面'
    },
  ],
  create(agent) {
    agent.onActionCall('reload', () => {
      location.reload()
    })
  }
}

export default PageDef