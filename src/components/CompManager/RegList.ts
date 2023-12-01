import HTTPDataSource from "@/components/Presets/DataSources/http";
import ButtonDef from "@/components/Presets/Basic/Button";
import InputDef from "@/components/Presets/Input/Input";
import ListLayoutDef from "@/components/Presets/Layout/List";
import ParagraphDef from "@/components/Presets/Basic/P";
import { UIComp, CompDefBase } from "@/libs/core/Def";
import VarDataSource from "@/components/Presets/DataSources/var";
import AlertDef from "../Presets/Feedback/Alert";
import CardDef from "../Presets/Display/Card";
import AvatarDef from "../Presets/Display/Avatar";
import CarouselDef from "../Presets/Display/Carousel";
import DividerDef from "../Presets/Display/Divider";
import SpaceDef from "../Presets/Display/Space";
import SelectDef from "../Presets/Input/Select";
import HeaderDef from "../Presets/Display/Header";
import SwitchDef from "../Presets/Input/Switch";


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
    category: 'display',
    label: 'Display',
    items: [
      CardDef,
      AvatarDef,
      CarouselDef,
      DividerDef,
      SpaceDef,
      HeaderDef
    ]
  },
  {
    category: 'input',
    label: 'Input',
    items: [
      InputDef,
      SelectDef,
      SwitchDef
    ]
  },
  {
    category: 'feedback',
    label: '反馈',
    items: [
      AlertDef
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
