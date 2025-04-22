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
import Loading from '@/components/loading'
export type MessagesProps = {
}

const Messages: FC<MessagesProps> = () => {

  const dispatch = useDispatch<AppDispatch>()
  const session = useSelector((state: RootState) => state.session)
  const conversations = useSelector((state: RootState) => state.conversations)
  const { value: messages, loading, error } = useSelector((state: RootState) => state.messages)
  const feedbackDisabled = false

  const container = useRef<HTMLDivElement>(null)

  const [query, setQuery] = React.useState('')
  const handleContentChange = (e: any) => {
    const value = e.target.value
    setQuery(value)
  }

  useEffect(() => {
    dispatch(clearMessages())
    console.log('messages.tsx---session.currentConversation', session.currentConversation, conversations.value)
    if (!session.currentConversation) {
      return
    }
    if (session.currentConversation === '-1') {
      // dispatch(clearMessages())
      return
    }
    if (!conversations.value.find((c) => c.id === session.currentConversation)) {
      console.log('oooooooooo---conversation not found, clear messages')
      // conversation not found, clear messages
      // this means user come from a history URL that the conversation is deleted
      // dispatch(clearMessages())
      // dispatch(closeChat())
      return
    }
    dispatch(fetchMessages(session.currentConversation))
  }, [session.currentConversation, conversations])

  useEffect(() => {
    if (container.current) {
      container.current.scrollTop = container.current.scrollHeight
    }
  }, [messages])


  return (
    <div className='chat h-full relative inset-0'>
      <div className="h-full flex flex-col items-center overflow-y-auto" ref={container}>
        <div className='p-4 pb-60 max-w-4xl w-full'>
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
              <Loading />
            </div>
          }
        </div>
      </div>
      <div className={cn(!feedbackDisabled && 'left-3.5! right-3.5!', 'absolute z-10 bottom-0 left-0 right-0')}>
        <InputBox />
      </div>
    </div>
  )
}

export default React.memo(Messages)
