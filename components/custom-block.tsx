import React from 'react'
import { CodeLanguage } from '@/models'
import { FormBlock, CardBlock } from './blocks'

interface CustomBlockProps {
  data?: Record<string, any>
  type?: 'form' | 'card' | 'custom'
}

/**
 * 在对话中显示自定义内容
 * @param param0 
 * @returns 
 */
const CustomBlock: React.FC<CustomBlockProps> = ({ data = {}, type = 'json' }) => {
  if (type === 'form' && Array.isArray(data.fields)) {
    return (
      <FormBlock fields={data.fields} />
    )
  }

  if (type === 'card') {
    return (
      <CardBlock fields={data.fields} />
    )
  }

  return (
    <div className="json-output-wrapper">
    </div>
  )
}

export default CustomBlock
