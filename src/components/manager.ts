import HTTPDataSource from "./Presets/DataSources/http";
import ButtonDef from "./Presets/Basic/Button";
import InputDef from "./Presets/Basic/Input";
import ListLayoutDef from "./Presets/Layout/List";
import ParagraphDef from "./Presets/Typo/P";
import { UIComp, DataSource } from "../libs/core/Def";
import { ProviderManager } from "../libs/core/ProviderManager";
import VarDataSource from "./Presets/DataSources/var";


export const pMan = new ProviderManager()

pMan.regComp(HTTPDataSource)
pMan.regComp(VarDataSource)

pMan.regComp(InputDef)
pMan.regComp(ButtonDef)
pMan.regComp(ParagraphDef)
pMan.regComp(ListLayoutDef)