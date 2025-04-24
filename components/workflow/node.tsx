'use client'
import type { FC } from 'react'
import { useEffect, useState } from 'react'
import cn from 'classnames'
import { AlertCircle, AlertTriangle, CheckCircle, LoaderCircle } from 'lucide-react'
import type { WorkflowNode } from '@/models'
import { Icon } from '../icon'

type Props = {
  data: WorkflowNode
}

const NodeView: FC<Props> = ({ data }) => {
  const [collapseState, setCollapseState] = useState<boolean>(true)

  const getTime = (time: number) => {
    if (time < 1)
      return `${(time * 1000).toFixed(3)} ms`
    if (time > 60)
      return `${parseInt(Math.round(time / 60).toString())} m ${(time % 60).toFixed(3)} s`
    return `${time.toFixed(3)} s`
  }

  const getTokenCount = (tokens: number) => {
    if (tokens < 1000)
      return tokens
    if (tokens >= 1000 && tokens < 1000000)
      return `${parseFloat((tokens / 1000).toFixed(3))}K`
    if (tokens >= 1000000)
      return `${parseFloat((tokens / 1000000).toFixed(3))}M`
  }

  useEffect(() => {
    setCollapseState(!data.expand)
  }, [data.expand])

  const iconColorMap: Record<string, string> = {
    'start': '#2970FF',
    'llm': '#6172F3',
    'code': '#2E90FA',
    'end': '#F79009',
    'if-else': '#06AED4',
    'http-request': '#875BF7',
    'answer': '#F79009',
    'knowledge-retrieval': '#16B364',
    'question-classifier': '#16B364',
    'template-transform': '#2E90FA',
    'variable-assigner': '#2E90FA',
  }

  return (
    <div className={cn(
      'group transition-all bg-white border border-gray-100',
      'rounded-md hover:shadow-md',
      'flex items-center p-1 justify-between cursor-pointer gap-2',
    )}
      onClick={() => setCollapseState(!collapseState)}>
      <Icon name={data.type} fill={iconColorMap[data.type] || ''} />
      <div className={cn(
        'grow text-gray-700 text-[12px] font-semibold truncate',
      )} title={data.title}>{data.title}</div>
      {data.status !== 'running' && (
        <div className='shrink-0 text-gray-500 text-xs leading-[18px]'>
          {`${getTime(data.time || 0)} · ${getTokenCount(data.metadata?.totalTokens || 0)} tokens`}
        </div>
      )}
      {data.status === 'succeeded' && (
        <CheckCircle className='shrink-0 ml-2 w-3.5 h-3.5 text-[#12B76A]' />
      )}
      {data.status === 'failed' && (
        <AlertCircle className='shrink-0 ml-2 w-3.5 h-3.5 text-[#F04438]' />
      )}
      {data.status === 'stopped' && (
        <AlertTriangle className='shrink-0 ml-2 w-3.5 h-3.5 text-[#F79009]' />
      )}
      {data.status === 'running' && (
        <div className='shrink-0 flex items-center text-primary-600 text-[13px] leading-[16px] font-medium'>
          <LoaderCircle className='mr-1 w-3.5 h-3.5 animate-spin' />
          <span>Running</span>
        </div>
      )}
    </div>
  )
}

export default NodeView
