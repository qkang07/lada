import HTTPDataSource from "./Presets/DataSources/http";
import ButtonDef from "./Presets/Basic/Button";
import InputDef from "./Presets/Basic/Input";
import ListLayoutDef from "./Presets/Layout/List";
import ParagraphDef from "./Presets/Typo/P";
import { DefManager, UIComp, DataSource } from "../libs/core/Def";
import VarDataSource from "./Presets/DataSources/var";


export const compMan = new DefManager()

compMan.regComp(HTTPDataSource)
compMan.regComp(VarDataSource)

compMan.regComp(InputDef)
compMan.regComp(ButtonDef)
compMan.regComp(ParagraphDef)
compMan.regComp(ListLayoutDef)