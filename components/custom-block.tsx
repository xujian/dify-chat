import React from 'react'
import { CodeLanguage } from '@/models'
import { FormBlock, CardBlock } from './blocks'
import { CustomBlockProps } from './types'

/**
 * 在对话中显示自定义内容
 * @param param0 
 * @returns 
 */
const CustomBlock: React.FC<CustomBlockProps> = ({ data = {}, type = 'json' }) => {

  if (data.type === 'form') {
    return (
      <FormBlock data={data} />
    )
  }

  if (data.type === 'card') {
    return (
      <CardBlock data={data} />
    )
  }

  return (
    <div className="json-output-wrapper">
    </div>
  )
}

export default CustomBlock
