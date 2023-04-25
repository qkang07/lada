import { Input, Menu, Trigger } from '@arco-design/web-react'
import React, { useEffect, useState } from 'react'

type SugProps = {
  onChoose: (type: string) => void
}

const Suggestions = (props: SugProps) => {
  return <Menu onClickMenuItem={key => {
    props.onChoose(key)
  }}>
    <Menu.Item key='button' >Button</Menu.Item>
    <Menu.Item key='link' >Link</Menu.Item>
  </Menu>
}

type Props = {}

const SmartInput = (props: Props) => {
  const [userInput, setUserInput] = useState('')
  const [popupVisible, setPopupVisible] = useState(false)

  useEffect(() => {
    if(userInput.startsWith('/')) {
      setPopupVisible(true)
    }
  }, [userInput])

  const handleChoose = (type: string) => {
    console.log('select key', type);
    
    setPopupVisible(false)
    setUserInput('')
  }

  return (
    <div>
      <Trigger
        popupVisible={popupVisible}
        popup={() => <Suggestions
          onChoose={handleChoose}
        />}
      >

        <Input value={userInput} aria-autocomplete='none'  onChange={v => {
          setUserInput(v)
        }}/>
      </Trigger>
    </div>
  )
}

export default SmartInput