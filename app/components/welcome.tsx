'use client'
import type { FC } from 'react'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '@/app/store'
import { Button } from './ui'
import { startChat } from '@/app/store/session'
import { addConversation } from '@/app/store/conversations'
import { greet } from '@/app/store/messages'
import Inputs from './inputs'

const Welcome: FC = () => {

  const serverConfig = useSelector((state: RootState) => state.server),
    session = useSelector((state: RootState) => state.session)
  const dispatch = useDispatch()

  const handleChat = () => {
    dispatch(addConversation({
      id: '-1',
      name: '新对话',
      introduction: '',
      inputs: {},
    }))
    dispatch(greet(serverConfig.openingStatement))
    dispatch(startChat())
  }

  return (
    <div className='welcome h-full flex flex-col items-center justify-center min-h-[200px]'>
      <div className='mx-auto'>
        <Inputs fields={serverConfig.variables} />
        <Button className='my-3'
          onClick={handleChat}>开始对话</Button>
      </div>
    </div>
  )
}

export default React.memo(Welcome)
