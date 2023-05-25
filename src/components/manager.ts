import HTTPDataProvider from "./DataProviders/http";
import ButtonDef from "./Presets/Basic/Button";
import InputDef from "./Presets/Basic/Input";
import ListLayoutDef from "./Presets/Layout/List";
import ParagraphDef from "./Presets/Typo/P";
import { DefManager, DataProviderDef, UIComp, DataSource } from "./compDef";

export const uiMan = new DefManager<UIComp.Def>()
export const dsMan = new DefManager<DataSource.Def>()

export const dataProviderMap: Record<string, DataProviderDef> = {}

dataProviderMap['http'] = HTTPDataProvider

uiMan.regComp(InputDef)
uiMan.regComp(ButtonDef)
uiMan.regComp(ParagraphDef)
uiMan.regComp(ListLayoutDef)