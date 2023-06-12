import { CompDefBase, CompInstanceBase, DefManager } from "./compDef";

export class BindingScope {
  compMap: Map<string, CompInstanceBase> = new Map()

  constructor(public man: DefManager<CompDefBase>) {

  }

  regComp() {

  }
  makeFromSchema() {
    
  }
}