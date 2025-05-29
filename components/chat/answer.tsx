'use client'
import type { FC } from 'react'
import React from 'react'
import { HandThumbDownIcon, HandThumbUpIcon } from '@heroicons/react/24/outline'
import { useTranslation } from 'react-i18next'
import * as motion from 'motion/react-client'
import Loading from '../loading'
import s from './style.module.css'
import Thought from './thought'
import { TooltipProvider, TooltipTrigger } from '@/components/ui'
import WorkflowView from '@/components/workflow/workflow'
import { Markdown } from '@/components/markdown'
import type { Emoji } from '@/models/tools'
import CustomBlock from '../custom-block'
import { FeedbackHandler, Message, MessageRating } from '@/models'
import { TooltipContent, TooltipPortal } from '@radix-ui/react-tooltip'
import { APP_INFO } from '@/config'
import FileList from '../upload/file-list'

const RatingIcon: FC<{ isLike: boolean }> = ({ isLike }) => {
  return isLike
    ? <HandThumbUpIcon className='w-4 h-4' />
    : <HandThumbDownIcon className='w-4 h-4' />
}

type AnswerProps = {
  item: Message
  feedbackDisabled: boolean
  onFeedback?: FeedbackHandler
  isResponding?: boolean
  allToolIcons?: Record<string, string | Emoji>
}

// The component needs to maintain its own state to control whether to display input component
const Answer: FC<AnswerProps> = ({
  item,
  feedbackDisabled = false,
  onFeedback,
  isResponding,
  allToolIcons,
}) => {
  const { id, content, feedback, thoughts, workflow } = item
  const isAgentMode = !!thoughts && thoughts.length > 0

  const { t } = useTranslation()

  /**
 * Render feedback results (distinguish between users and administrators)
 * User reviews cannot be cancelled in Console
 * @param rating feedback result
 * @param isUserFeedback Whether it is user's feedback
 * @returns comp
 */
  const renderFeedback = (rating: MessageRating | undefined) => {
    if (!rating)
      return null

    const isLike = rating === 'like'
    const ratingIconClassname = isLike
      ? 'text-primary-600 bg-primary-100 hover:bg-primary-200'
      : 'text-red-600 bg-red-100 hover:bg-red-200'
    return (
      <TooltipProvider>
        <TooltipTrigger>
          <div className={`${ratingIconClassname} rounded-lg h-6 w-6 flex items-center justify-center`}>
            <RatingIcon isLike={isLike} />
          </div>
        </TooltipTrigger>
        <TooltipPortal>
          <TooltipContent>
            {isLike ? '取消赞同' : '取消反对'}
          </TooltipContent>
        </TooltipPortal>
      </TooltipProvider>
    )
  }

  const Thoughts = () => {
    return (
      <div>
        {thoughts?.map((item, index) => (
          <div key={index}>
            {item.content && (
              <Markdown content={item.content} />
            )}
            {!!item.tool && (
              <Thought
                thought={item}
                allToolIcons={allToolIcons || {}}
                isFinished={!!item.observation || !isResponding}
              />
            )}
            <FileList data={item.files?.filter(f => f.type === 'image') || []} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div key={id} data-id={id} className='answer w-full max-w-[600px] flex items-start py-1 gap-2 motion-pulse'>
      <div className={`${s.answerIcon} w-8 h-8 shrink-0`}>
        {isResponding
          ? (
            <motion.div
              className="flex items-center justify-center w-8 h-8 rounded-full border-gray-300"
              animate={{
                boxShadow: [
                  '0 0 0 0 rgba(0,0,0,0.5)',
                  '0 0 0 6px rgba(0,0,0,0)',
                  '0 0 0 0 rgba(0,0,0,0.5)'
                ],
              }}
              transition={{
                duration: 2,
                ease: ['easeInOut'],
                repeat: Infinity,
                repeatDelay: 0,
                repeatType: 'mirror'
              }}>
              <img src="/logo.png" alt="logo" width={24} height={24} className="opacity-70" />
            </motion.div>
          )
          : (
            <div className={s.answerIcon}>
              <img src="/logo.png" alt="logo" width={32} height={32} />
            </div>
          )
        }
      </div>
      <div className={`${s.answer} grow relative text-sm`}>
        <div className={`py-2 px-2 bg-gray-100 rounded-xl`}>
          {APP_INFO.useWorkflow && workflow && (
            <WorkflowView data={workflow} />
          )}
          {
            isResponding && (
              isAgentMode
                ? (!content && thoughts?.filter(
                  item => !!item.content || !!item.tool).length === 0
                ) || !isResponding
                : !content
            )
              ? (
                <div className='flex items-center justify-center w-6 h-5'>
                  <Loading type='text' />
                </div>
              )
              : (isAgentMode
                ? Thoughts()
                : (
                  item.format === 'json'
                    ? <CustomBlock data={item.customContent} />
                    : <Markdown content={content} />
                )
              )}
        </div>
        <div className='absolute top-[-14px] right-[-14px] flex flex-row justify-end gap-1'>
          {!feedbackDisabled && renderFeedback(feedback?.rating)}
        </div>
      </div>
    </div>
  )
}

export default React.memo(Answer)
