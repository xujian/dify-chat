'use client'
import type { FC } from 'react'
import React, { useEffect, useRef } from 'react'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import Answer from './answer'
import Question from './question'
import { TransferMethod } from '@/types/app'
import Toast from '@/app/components/base/toast'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/app/store'
import { fetchMessages } from '@/app/store/messages'
import InputBox from './input-box'
import type { Message } from '@/models'
export type MessagesProps = {
}

const Messages: FC<MessagesProps> = () => {

  const dispatch = useDispatch<AppDispatch>()
  const session = useSelector((state: RootState) => state.session)
  const { value: messages, loading, error } = useSelector((state: RootState) => state.messages)
  const feedbackDisabled = false
  const visionConfig = {
    enabled: true,
    number_limits: 2,
    detail: 'low',
    transfer_methods: [TransferMethod.local_file],
  }

  const { t } = useTranslation()
  const { notify } = Toast
  const isUseInputMethod = useRef(false)

  const [query, setQuery] = React.useState('')
  const handleContentChange = (e: any) => {
    const value = e.target.value
    setQuery(value)
  }

  const logError = (message: string) => {
    notify({ type: 'error', message, duration: 3000 })
  }

  const valid = () => {
    if (!query || query.trim() === '') {
      logError('Message cannot be empty')
      return false
    }
    return true
  }

  const handleSend = () => {
    // if (!valid() || (checkCanSend && !checkCanSend()))
    //   return
    // onSend(query, files.filter(file => file.progress !== -1).map(fileItem => ({
    //   type: 'image',
    //   transfer_method: fileItem.type,
    //   url: fileItem.url,
    //   upload_file_id: fileItem.fileId,
    // })))
    // if (!files.find(item => item.type === TransferMethod.local_file && !item.fileId)) {
    //   if (files.length)
    //     onClear()
    //   if (!isResponding)
    //     setQuery('')
    // }
  }

  const handleKeyUp = (e: any) => {
    if (e.code === 'Enter') {
      e.preventDefault()
      // prevent send message when using input method enter
      if (!e.shiftKey && !isUseInputMethod.current)
        handleSend()
    }
  }

  const handleKeyDown = (e: any) => {
    isUseInputMethod.current = e.nativeEvent.isComposing
    if (e.code === 'Enter' && !e.shiftKey) {
      setQuery(query.replace(/\n$/, ''))
      e.preventDefault()
    }
  }

  useEffect(() => {
    if (session.currentConversation?.id !== '-1') {
      dispatch(fetchMessages(session.currentConversation.id))
    }
  }, [session.currentConversation])


  return (
    <div className='chat h-full'>
      <div className="h-full py-2">
        {messages.map((item) => {
          if (item.type === 'answer') {
            const isLast = item.id === messages[messages.length - 1].id
            return <Answer
              key={item.id}
              item={item}
              feedbackDisabled={false} //{feedbackDisabled}
              onFeedback={() => Promise.resolve()} //{onFeedback}
              isResponding={session.responding} //{isResponding && isLast}
            />
          }
          return (
            <Question
              key={item.id}
              id={item.id}
              content={item.content}
              useCurrentUserAvatar={true} //{useCurrentUserAvatar}
              imgSrcs={(item.message_files && item.message_files?.length > 0) ? item.message_files.map(item => item.url) : []}
            />
          )
        })}
      </div>
      <div className={cn(!feedbackDisabled && '!left-3.5 !right-3.5', 'absolute z-10 bottom-0 left-0 right-0')}>
        <InputBox />
      </div>
    </div>
  )
}

export default React.memo(Messages)
