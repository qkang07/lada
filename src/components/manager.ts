import HTTPDataSource from "./Presets/DataSources/http";
import ButtonDef from "./Presets/Basic/Button";
import InputDef from "./Presets/Basic/Input";
import ListLayoutDef from "./Presets/Layout/List";
import ParagraphDef from "./Presets/Typo/P";
import { UIComp, CompDefBase } from "../libs/core/Def";
import { ProviderManager } from "../libs/core/ProviderManager";
import VarDataSource from "./Presets/DataSources/var";
import PageDef from "./Presets/Page";

// export const uiMan = new ProviderManager<UIComp.Def>()
// export const dMan = new ProviderManager<DataSource.Def>()
export const compMan = new ProviderManager()

// compMan.regComp(HTTPDataSource)
// compMan.regComp(VarDataSource)

compMan.regComp(InputDef)
compMan.regComp(ButtonDef)
compMan.regComp(ParagraphDef)
compMan.regComp(ListLayoutDef)

compMan.regComp(PageDef)