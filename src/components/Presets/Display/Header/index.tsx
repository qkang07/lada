import { UIComp } from "@/libs/core/Def";


const HeaderDef: UIComp.Def = {
  name: 'header-pc',
  label: '页头',

  props: [
    {
      name: 'logo',
      valueType: 'string',
      desc: 'logo 链接',
      editor: {type:'string'}
    },
    {
      name: 'title',
      valueType: 'string'
    }
  ],
  slots: [
    {
      name: 'left',
      
    },
    {
      name: 'center',

    },
    {
      name: 'right'
    }
  ]
}