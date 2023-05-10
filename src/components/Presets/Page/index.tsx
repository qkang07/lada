import { PageDef } from "@/components/compDef";



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