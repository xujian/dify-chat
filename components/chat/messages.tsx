'use client'
import type { FC } from 'react'
import React, { useEffect, useRef } from 'react'
import cn from 'classnames'
import Answer from './answer'
import Question from './question'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store'
import { clearMessages, fetchMessages } from '@/store/messages'
import InputBox from './input-box'
import { toast } from '@/components/toast'
import Loading from '@/components/loading'
export type MessagesProps = {
}

const Messages: FC<MessagesProps> = () => {

  const dispatch = useDispatch<AppDispatch>()
  const session = useSelector((state: RootState) => state.session)
  const { value: messages, loading, error } = useSelector((state: RootState) => state.messages)
  const feedbackDisabled = false

  const container = useRef<HTMLDivElement>(null)

  const [query, setQuery] = React.useState('')
  const handleContentChange = (e: any) => {
    const value = e.target.value
    setQuery(value)
  }

  const logError = (message: string) => {
    toast({ type: 'error', message })
  }

  const valid = () => {
    if (!query || query.trim() === '') {
      logError('Message cannot be empty')
      return false
    }
    return true
  }

  useEffect(() => {
    console.log('oooooooooo---session.currentConversation', session.currentConversation)
    if (session.currentConversation && session.currentConversation !== '-1') {
      dispatch(fetchMessages(session.currentConversation))
    } else {
      // just created conversation, clear messages
      dispatch(clearMessages())
    }
  }, [session.currentConversation])

  useEffect(() => {
    if (container.current) {
      container.current.scrollTop = container.current.scrollHeight
    }
  }, [messages])


  return (
    <div className='chat h-full relative inset-0'>
      <div className="h-full pt-2 pb-24 overflow-y-auto" ref={container}>
        {messages.map((item) => {
          if (item.type === 'answer') {
            const isLast = item.id === messages[messages.length - 1].id
            return <Answer
              key={item.id}
              item={item}
              feedbackDisabled={false}
              onFeedback={() => Promise.resolve()}
              isResponding={session.responding}
            />
          }
          return (
            <Question
              key={item.id}
              id={item.id}
              content={item.content}
              files={item.files || []}
            />
          )
        })}
        {loading &&
          <div className="flex justify-center items-center h-full">
            <Loading type="avatar" />
          </div>
        }
      </div>
      <div className={cn(!feedbackDisabled && 'left-3.5! right-3.5!', 'absolute z-10 bottom-0 left-0 right-0')}>
        <InputBox />
      </div>
    </div>
  )
}

export default React.memo(Messages)
