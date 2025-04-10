import React from 'react'
import { CodeLanguage } from '@/models'
import CodeEditor from './code-editor'
import FormBlock from './custom/form-block'

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
      <FormBlock data={data} />
    )
  }

  if (type === 'card') {
    return (
      <div className="p-4 border rounded-lg">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="mb-2">
            <span className="font-medium">{key}: </span>
            <span>{String(value)}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="json-output-wrapper">
      <CodeEditor
        value={data}
        title={<div className='text-sm text-gray-500'>Output</div>}
        language={CodeLanguage.json}
        readOnly={true}
        isJSONStringifyBeauty={true}
      />
    </div>
  )
}

export default CustomBlock
