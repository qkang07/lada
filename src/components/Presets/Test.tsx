import { UIComp } from "@/libs/core/Def";


type Props = {}

const TestDef : UIComp.Def<Props> = {
  name: 'test0',
  render(){
    return <>
      <div></div>
      <div></div>
    </>
  }
}