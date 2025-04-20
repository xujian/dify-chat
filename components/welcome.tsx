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
import { useVariables } from '@/hooks'

const Welcome: FC = () => {

  const session = useSelector((state: RootState) => state.session)
  const { variables, variablesFullfilled } = useVariables()

  const dispatch = useDispatch()
  const { config } = useServer()

  const handleStartChat = () => {
    dispatch(createConversation())
    dispatch(greet(config.openingStatement))
    dispatch(startChat())
  }

  useEffect(() => {
    if (variablesFullfilled) {
      handleStartChat()
    }
  }, [variablesFullfilled])

  return (
    <div className='welcome h-full flex flex-col items-center justify-center min-h-[200px]'>
      <div className='mx-auto'>
        <Inputs fields={config.variables} />
        <Button className='my-3'
          onClick={handleStartChat}>开始对话</Button>
      </div>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  )
}

export default React.memo(Welcome)
