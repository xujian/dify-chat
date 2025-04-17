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
import { useServer } from '@/context/server'

const Welcome: FC = () => {

  const session = useSelector((state: RootState) => state.session)
  const dispatch = useDispatch()
  const { config } = useServer()

  const handleChat = () => {
    dispatch(addConversation({
      id: '-1',
      name: '新对话',
      introduction: '',
      inputs: {},
    }))
    dispatch(greet(config.openingStatement))
    dispatch(startChat())
  }

  return (
    <div className='welcome h-full flex flex-col items-center justify-center min-h-[200px]'>
      <div className='mx-auto'>
        <Inputs fields={config.variables} />
        <Button className='my-3'
          onClick={handleChat}>开始对话</Button>
      </div>
    </div>
  )
}

export default React.memo(Welcome)
