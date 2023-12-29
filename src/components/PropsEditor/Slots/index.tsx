import { compMan } from '@/components/CompManager/manager';
import { DesignerContext } from '@/components/Designer';
import SidePane from '@/components/UIKit/SidePane'
import { UIComp } from '@/libs/core/Def';
import React, { useContext, useState } from 'react'
import styles from './index.module.less'
import pstyle from '../index.module.less'
import { Input, Switch } from '@arco-design/web-react';
import { action } from 'mobx';

type Props = {}

const CompSlots = (props: Props) => {
  const { designerStore, } = useContext(DesignerContext);
  const def = designerStore.currentAgent?.def as UIComp.Def

  if(!def.render) {
    return <></>
  }

  const updateSlotSchema = action((name: string, schema: UIComp.SlotSchema) => {
    // TODO current work
  })
  return (
    <SidePane title='插槽'>
      {def.slots?.map(slot => {
        // const slotSchema = schema?.slots?.find(s => s.name === slot.name)
        // const [showText, setShowText] = useState(!!slotSchema?.text || !!slotSchema?.children?.length )

        return <div key={slot.name} className={`${styles.slotItem} ${pstyle.propField}`}>
          <span className={pstyle.label}>{slot.label || slot.name}</span>
          {/* <div className={pstyle.rightPart}>
            <div style={{flex: 1}}>
            手动输入：<Switch checked={showText} onChange={v => {
              setShowText(v)
            }}/>
            {
              showText &&       <div style={{marginTop: 4}}>
              <Input.TextArea value={slotSchema?.text} onChange={v => {
                slotSchema?.text = v
                
              }}></Input.TextArea>
            </div>
            }
      

            </div>
          </div> */}
        </div>
      })}
    </SidePane>
  )
}

export default CompSlots