import HTTPDataSource from "./Presets/DataSources/http";
import ButtonDef from "./Presets/Basic/Button";
import InputDef from "./Presets/Basic/Input";
import ListLayoutDef from "./Presets/Layout/List";
import ParagraphDef from "./Presets/Typo/P";
import { DefManager, UIComp, DataSource } from "./compDef";
import VarDataSource from "./Presets/DataSources/var";

export const uiMan = new DefManager<UIComp.Def>()
export const dsMan = new DefManager<DataSource.Def>()

export const compMan = new DefManager()

dsMan.regComp(HTTPDataSource)
dsMan.regComp(VarDataSource)

uiMan.regComp(InputDef)
uiMan.regComp(ButtonDef)
uiMan.regComp(ParagraphDef)
uiMan.regComp(ListLayoutDef)