import HTTPDataSource from "./Presets/DataSources/http";
import ButtonDef from "./Presets/Basic/Button";
import InputDef from "./Presets/Basic/Input";
import ListLayoutDef from "./Presets/Layout/List";
import ParagraphDef from "./Presets/Typo/P";
import { UIComp, DataSource, CompDefBase } from "../libs/core/Def";
import { ProviderManager } from "../libs/core/ProviderManager";
import VarDataSource from "./Presets/DataSources/var";

export const uiMan = new ProviderManager<UIComp.Def>()
export const dMan = new ProviderManager<DataSource.Def>()

dMan.regComp(HTTPDataSource)
dMan.regComp(VarDataSource)

uiMan.regComp(InputDef)
uiMan.regComp(ButtonDef)
uiMan.regComp(ParagraphDef)
uiMan.regComp(ListLayoutDef)