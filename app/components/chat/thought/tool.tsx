'use client'
import type { FC } from 'react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LoaderCircle } from 'lucide-react'
import cn from 'classnames'
import Panel from './panel'

import { ChevronDown, CheckCircle, Database } from 'lucide-react'

import type { Emoji } from '@/models/tools'
import AppIcon from '@/app/components/base/app-icon'

type Props = {
  payload: ToolInfoInThought
  allToolIcons?: Record<string, string | Emoji>
}

const getIcon = (toolName: string, allToolIcons: Record<string, string | Emoji>) => {
  if (toolName.startsWith('dataset-'))
    return <Database className='shrink-0'></Database>
  const icon = allToolIcons[toolName]
  if (!icon)
    return null
  return (
    typeof icon === 'string'
      ? (
        <div
          className='w-3 h-3 bg-cover bg-center rounded-[3px] shrink-0'
          style={{
            backgroundImage: `url(${icon})`,
          }}
        ></div>
      )
      : (
        <AppIcon
          className='rounded-[3px] shrink-0'
          size='xs'
          icon={icon?.content}
          background={icon?.background}
        />
      ))
}

const Tool: FC<Props> = ({
  payload,
  allToolIcons = {},
}) => {
  const { t } = useTranslation()
  const { name, input, isFinished, output } = payload
  const toolName = name.startsWith('dataset-') ? t('dataset.knowledge') : name
  const [isShowDetail, setIsShowDetail] = useState(false)
  const icon = getIcon(toolName, allToolIcons) as any
  return (
    <div>
      <div className={cn(!isShowDetail && 'shadow-xs', !isShowDetail && 'inline-block', 'max-w-full overflow-x-auto bg-white rounded-md')}>
        <div
          className={cn('flex items-center h-7 px-2 cursor-pointer')}
          onClick={() => setIsShowDetail(!isShowDetail)}
        >
          {!isFinished && (
            <LoaderCircle className='w-3 h-3 text-gray-500 animate-spin shrink-0' />
          )}
          {isFinished && !isShowDetail && (
            <CheckCircle className='w-3 h-3 text-[#12B76A] shrink-0' />
          )}
          {isFinished && isShowDetail && (
            icon
          )}
          <span className='mx-1 text-xs font-medium text-gray-500 shrink-0'>
            {t(`tools.thought.${isFinished ? 'used' : 'using'}`)}
          </span>
          <span
            className='text-xs font-medium text-gray-700 truncate'
            title={toolName}
          >
            {toolName}
          </span>
          <ChevronDown
            className={cn(isShowDetail && 'rotate-180', 'ml-1 w-3 h-3 text-gray-500 select-none cursor-pointer shrink-0')}
          />
        </div>
        {isShowDetail && (
          <div className='border-t border-black/5 p-2 space-y-2 '>
            <Panel
              isRequest={true}
              toolName={toolName}
              content={input} />
            {output && (
              <Panel
                isRequest={false}
                toolName={toolName}
                content={output as string} />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
export default React.memo(Tool)
