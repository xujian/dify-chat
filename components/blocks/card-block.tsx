import React, { useMemo } from 'react'
import { Field } from '@/models'
import presets from './cards'
import { CustomBlockData, CustomBlockProps } from './types'

const CardBlock: React.FC<CustomBlockProps> = ({ data }) => {

  const Component = useMemo(() => {
    return data.preset in presets
      ? presets[data.preset]
      : null
  }, [data.preset])

  return (
    <div className='flex flex-col gap-1'>
      {Component
        ? <Component data={data} />
        : data.fields.map((field) => (
          <div key={field.name}>{field.name}</div>
        ))
      }
    </div>
  )
}

export default CardBlock
