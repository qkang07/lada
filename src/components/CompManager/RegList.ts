import HTTPDataSource from "@/components/Presets/DataSources/http";
import ButtonDef from "@/components/Presets/Basic/Button";
import InputDef from "@/components/Presets/Basic/Input";
import ListLayoutDef from "@/components/Presets/Layout/List";
import ParagraphDef from "@/components/Presets/Typo/P";
import { UIComp, CompDefBase } from "@/libs/core/Def";
import VarDataSource from "@/components/Presets/DataSources/var";


export type CompRegCat = {
  category: string
  label: string
  items: CompDefBase[]
}

console.log(ListLayoutDef)

export const UICompRegTable: CompRegCat[] = [
  {
    category: 'layout',
    label: 'Layout',
    items: [
      ListLayoutDef,
      
    ]
  },
  
  {
    category: 'basic',
    label: 'Basic',
    items: [
      ButtonDef,
      ParagraphDef
    ]
  },
  {
    category: 'input',
    label: 'Input',
    items: [
      InputDef
    ]
  }
]


export const DataSourceRegTable: CompRegCat[] = [
  {
    category: 'datasource',
    label: 'Data Source',
    items: [
      HTTPDataSource,
      VarDataSource
    ]
  }
]


export const PureCompRegTable: CompRegCat[] = [
  {
    category: 'pure',
    label: 'Pure Component',
    items: []
  }
]
