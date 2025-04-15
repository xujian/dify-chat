import { FC, useState, useEffect } from 'react'
import fieldComponents from '@/components/fields'
import type { Field } from '@/models'

export type InputsProps = {
  fields: Field[]
}

const Inputs: FC<InputsProps> = ({ fields }) => {
  return (
    <div className='flex flex-col gap-4'>
      {fields.map((field) => {
        const r = fieldComponents[field.type] as FC<Field>
        if (!r) return (
          <fieldComponents.dummy key={field.name} {...field} />
        )
        const Component = () => r(field)
        return (
          <Component key={field.name} />
        )
      })}
    </div>
  )
}

export default Inputs
