import { UIComp } from "@/libs/core/Def";
import styles from './index.module.less'
import SlotHolder from "@/components/SlotHolder";


type HeaderProps = {
  logo?: string
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
      name: 'title',
      valueType: 'string'
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
    const {style, classNames, slots} = props
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
    return <div className={`${classNames} ${styles.header}`} style={{...style}}>
      <div className={styles.left}>
        <SlotHolder schema={leftSlot}>
          <div className={styles.logo}>
            {props.logo && <img src={props.logo}/>}
          </div>
          <div className={styles.title}>{props.title}</div>
        </SlotHolder>
      </div>
      <div className={styles.center}>
        <SlotHolder schema={centerSlot}></SlotHolder>
      </div>
      <div className={styles.right}>
        <SlotHolder schema={rightSlot}></SlotHolder>
      </div>
    </div>
  }
}