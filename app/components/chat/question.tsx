'use client'
import type { FC } from 'react'
import React from 'react'
import { CircleUserRound } from 'lucide-react'
import type { Message } from '@/models'
import s from './style.module.css'

import { Markdown } from '@/app/components/markdown'
import ImageGallery from '@/app/components/image-gallery'

type QuestionProps = Pick<react, 'id' | 'content' | 'useCurrentUserAvatar'> & {
  imgSrcs?: string[]
}

const Question: FC<QuestionProps> = ({ id, content, useCurrentUserAvatar, imgSrcs }) => {
  const userName = ['']
  return (
    <div className='flex items-start justify-end py-1' key={id}>
      <div>
        <div className={`${s.question} relative text-sm text-gray-900`}>
          <div
            className={'mr-2 py-3 px-4 bg-blue-500 rounded-tl-2xl rounded-b-2xl'}
          >
            {imgSrcs && imgSrcs.length > 0 && (
              <ImageGallery srcs={imgSrcs} />
            )}
            <Markdown content={content} />
          </div>
        </div>
      </div>
      <div className={`${s.questionIcon} w-10 h-10 shrink-0 flex items-center justify-center`}>
        <CircleUserRound className='w-8 h-8' />
      </div>
    </div>
  )
}

export default React.memo(Question)
