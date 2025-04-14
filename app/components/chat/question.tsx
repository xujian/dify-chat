'use client'
import type { FC } from 'react'
import React from 'react'
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
      {useCurrentUserAvatar
        ? (
          <div className='w-10 h-10 shrink-0 leading-10 text-center mr-2 rounded-full bg-primary-600 text-white'>
            {userName?.[0].toLocaleUpperCase()}
          </div>
        )
        : (
          <div className={`${s.questionIcon} w-10 h-10 shrink-0 `}></div>
        )}
    </div>
  )
}

export default React.memo(Question)
