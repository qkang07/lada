import { PageDef } from "@/libs/core/Def";



const DefaultPageDef: PageDef = {

  name:'defaultPage',
  actions: [
    {
      name: 'refresh'
    },
   
  ],

  create(ctx) {
    
    return {
      
    }
  }
}

export default DefaultPageDef