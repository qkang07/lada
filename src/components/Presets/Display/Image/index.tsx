import { UIComp } from "@/libs/core/Def";

type ImageProps = {
  src: string
  height?: number | string
}

const ImageDef: UIComp.Def<{}> = {
  name: 'image',
  render() {
    return <img/>
  }
}