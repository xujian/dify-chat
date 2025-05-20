'use client'
import type { FC } from 'react'
import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '@/store'
import { Button } from './ui'
import { startChat } from '@/store/session'
import { createConversation } from '@/store/conversations'
import { greet } from '@/store/messages'
import Inputs from './inputs'
import { useServer } from '@/context/server'

const Welcome: FC = () => {

  const session = useSelector((state: RootState) => state.session)

  const dispatch = useDispatch()
  const { config } = useServer()

  const handleStartChat = () => {
    dispatch(createConversation())
    dispatch(startChat())
    dispatch(greet(config.openingStatement))
  }

  useEffect(() => {
    if (session.variablesFullfilled) {
      handleStartChat()
    }
  }, [session.variablesFullfilled])

  return (
    <div className='welcome h-full flex flex-col items-center justify-center min-h-[200px]'>
      <div className='mx-auto'>
        <Inputs />
        <Button className='my-3'
          onClick={handleStartChat}>开始对话</Button>
      </div>
    </div>
  )
}

export default React.memo(Welcome)
