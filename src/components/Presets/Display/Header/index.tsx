import { UIComp } from "@/libs/core/Def";
import styles from './index.module.less'
import SlotHolder from "@/components/SlotHolder";


type HeaderProps = {
  logo?: string
  logoHeight?: number
  logoWidth?: number
  title?: string
}

const HeaderDef: UIComp.Def<HeaderProps> = {
  name: 'header-pc',
  label: '页头',

  props: [
    {
      name: 'logo',
      valueType: 'string',
      desc: 'logo 链接',
      editor: {type:'string'}
    },
    {
      name: 'logoHeight',
      valueType: 'number',
      defaultValue: 30,
      editor: {type: 'number'}
    },
    {
      name: 'logoWidth',
      valueType: 'number',
      editor: {type: 'number'}
    },
    {
      name: 'title',
      valueType: 'string',
      editor: {type: 'string'}
    }
  ],
  slots: [
    {
      name: 'left',
      
    },
    {
      name: 'center',

    },
    {
      name: 'right'
    }
  ],

  render(props) {
    const {domAttrs, slots} = props
    const {classNames} = domAttrs
    let leftSlot: UIComp.SlotSchema | undefined 
    let centerSlot: UIComp.SlotSchema | undefined
    let rightSlot: UIComp.SlotSchema | undefined

    slots?.forEach(slot => {
      if(slot.name === 'left' ) {
        leftSlot = slot
      } else if(slot.name === 'center') {
        centerSlot = slot
      } else if(slot.name === 'right') {
        rightSlot = slot
      }
    })
    return <div {...domAttrs} className={`${classNames} ${styles.header}`} >
      <SlotHolder className={styles.left} schema={leftSlot}>
        <div className={styles.logo}>
          {props.logo && <img src={props.logo}/>}
        </div>
        <div className={styles.title}>{props.title}</div>
      </SlotHolder>
      <SlotHolder className={styles.center} placeholder="中间部分" schema={centerSlot} ></SlotHolder>
      <SlotHolder className={styles.right} schema={rightSlot} placeholder="右侧"></SlotHolder>
    </div>
  }
}

export default HeaderDef