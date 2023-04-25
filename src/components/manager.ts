import HTTPDataProvider from "./DataProviders/http";
import ButtonDef from "./Presets/Basic/Button";
import InputDef from "./Presets/Basic/Input";
import ListLayoutDef from "./Presets/Layout/List";
import ParagraphDef from "./Presets/Typo/P";
import { CompManager, DataProviderDef } from "./compDef";

export const compMan = new CompManager()

export const dataProviderMap: Record<string, DataProviderDef> = {}

dataProviderMap['http'] = HTTPDataProvider

compMan.regComp(InputDef)
compMan.regComp(ButtonDef)
compMan.regComp(ParagraphDef)
compMan.regComp(ListLayoutDef)