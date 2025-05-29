'use client'
import type { FC } from 'react'
import React from 'react'
import type { Media, Upload } from '@/models'
import s from './style.module.css'

import { Markdown } from '@/components/markdown'
import FileList from '@/components/upload/file-list'

type QuestionProps = {
  id: string
  content: string
  files?: Media[]
}

const Question: FC<QuestionProps> = ({ id, content, files }) => {
  const userName = ['']
  return (
    <div className='flex items-start justify-end py-1 gap-2' key={id}>
      <div className={`${s.question} text-s bg-primary text-primary-foreground rounded-xl`}>
        {files && files.length > 0 && (
          <div className='-mb-2'>
            <FileList data={files as Upload[]} deletable={false} />
          </div>
        )}
        <div className='p-2'>
          <Markdown content={content} />
        </div>
      </div>
      <div className={`${s.questionIcon} w-8 h-8 shrink-0 flex items-center justify-center`}>
        <img src="/user.png" className='w-8 h-8' />
      </div>
    </div>
  )
}

export default React.memo(Question)
