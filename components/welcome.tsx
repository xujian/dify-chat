'use client'
import type { FC } from 'react'
import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '@/store'
import { Button } from './ui'
import { startChat } from '@/store/session'
import { addConversation } from '@/store/conversations'
import { greet } from '@/store/messages'
import Inputs from './inputs'
import { useServer } from '@/context/server'
import { useVariables } from '@/hooks'

const Welcome: FC = () => {

  const session = useSelector((state: RootState) => state.session)
  const { variables, variablesFulfilled } = useVariables()

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

  useEffect(() => {
    if (variablesFulfilled) {
      handleChat()
    }
  }, [variablesFulfilled])

  return (
    <div className='welcome h-full flex flex-col items-center justify-center min-h-[200px]'>
      <div className='mx-auto'>
        <Inputs fields={config.variables} />
        <Button className='my-3'
          onClick={handleChat}>开始对话</Button>
      </div>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  )
}

export default React.memo(Welcome)
