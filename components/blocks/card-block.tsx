import React from 'react'
import { Field } from '@/models'

interface CardBlockProps {
  fields: Field[]
}

const CardBlock: React.FC<CardBlockProps> = ({ fields }) => {

  return (
    <div className='flex flex-col gap-1'>
      {
        fields.map((field) => (
          <div key={field.name}>{field.name}</div>
        ))
      }
    </div>
  )
}

export default CardBlock
