'use client'
import type { FC } from 'react'
import React, { useEffect, useRef, useState } from 'react'
import cn from 'classnames'
import Answer from './answer'
import Question from './question'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store'
import { clearMessages, fetchMessages } from '@/store/messages'
import InputBox from './input-box'
import Loading from '@/components/loading'
import { setCurrentConversation } from '@/store/session'
export type MessagesProps = {
}

const Messages: FC<MessagesProps> = () => {

  const dispatch = useDispatch<AppDispatch>()
  const session = useSelector((state: RootState) => state.session)
  const [conversation, setConversation] = useState<string>(session.currentConversation)
  const { value: conversations, fufilled: conversationsFufilled } = useSelector((state: RootState) => state.conversations)
  const { value: messages, loading, error } = useSelector((state: RootState) => state.messages)
  const feedbackDisabled = false

  const container = useRef<HTMLDivElement>(null)

  const [query, setQuery] = React.useState('')
  const handleContentChange = (e: any) => {
    const value = e.target.value
    setQuery(value)
  }

  const loadMessages = () => {
    if (!conversation)
      return
    if (conversation === '-1')
      return
    if (!conversations.find((c) => c.id === conversation)) {
      // no matched conversation
      // seems the conversation is deleted
      // 对话已删除 conversationID 失效
      setConversation('-1')
      dispatch(setCurrentConversation('-1'))
      return
    }
    dispatch(clearMessages())
    dispatch(fetchMessages(conversation))
  }

  useEffect(() => {
    if (!session.currentConversation)
      return
    if (session.currentConversation === '-1')
      return
    if (conversation === '-1') {
      // just got the first answer
      // 刚刚获取到第一个回答
      // 设置当前对话
      // 无需 load messages
      setConversation(session.currentConversation)
      return
    }
    if (!conversations.find((c) => c.id === session.currentConversation)) {
      setConversation('-1')
      dispatch(setCurrentConversation('-1'))
      return
    }
    setConversation(session.currentConversation)
    loadMessages()
    // wait until conversations is loades
    // chances that the conversation ID is not found
    // the conversation is got from history URL
    // and the conversation is deleted
  }, [
    // When switch conversion at the sidebar
    session.currentConversation,
    conversationsFufilled
  ])

  useEffect(() => {
    loadMessages()
  }, [])

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
        {JSON.stringify(messages.map(item => item.id))}
      </div>
      <div className={cn(!feedbackDisabled && 'left-3.5! right-3.5!', 'absolute z-10 bottom-0 left-0 right-0')}>
        <InputBox />
      </div>
    </div>
  )
}

export default React.memo(Messages)
