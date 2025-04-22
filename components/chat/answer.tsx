'use client'
import type { FC } from 'react'
import React from 'react'
import { HandThumbDownIcon, HandThumbUpIcon } from '@heroicons/react/24/outline'
import { useTranslation } from 'react-i18next'
import Loading from '../loading'
import s from './style.module.css'
import ImageGallery from '../image-gallery'
import Thought from './thought'
import { TooltipProvider, TooltipTrigger } from '@/components/ui'
import WorkflowProcess from '@/components/workflow/workflow-process'
import { Markdown } from '@/components/markdown'
import type { Emoji } from '@/models/tools'
import CustomBlock from '../custom-block'
import { FeedbackHandler, Message, MessageRating } from '@/models'
import { TooltipContent, TooltipPortal } from '@radix-ui/react-tooltip'

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
  const { id, content, feedback, thoughts, workflowProcess } = item
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
            <ImageGallery items={item.files?.filter(f => f.type === 'image') || []} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div key={id} className='answer flex items-start py-1 motion-pulse'>
      <div className={`${s.answerIcon} ml-2 w-10 h-10 shrink-0`}>
        {isResponding
          ? (
            <div className={s.typeingIcon}>
              <Loading type='avatar' />
            </div>
          )
          : (
            <div className={s.answerIcon}>
              <img src="/logo.png" alt="logo" width={32} height={32} />
            </div>
          )
        }
      </div>
      <div className={`${s.answer} relative text-sm`}>
        <div className={`ml-2 py-3 px-3 bg-gray-100 rounded-tr-2xl rounded-b-2xl ${workflowProcess && 'min-w-[480px]'}`}>
          {workflowProcess && (
            <WorkflowProcess data={workflowProcess} hideInfo />
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
