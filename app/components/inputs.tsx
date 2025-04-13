import { FC, useState, useEffect } from 'react'
import fieldComponents from '@/app/components/fields'
import { Field } from '@/models'

export type InputsProps = {
  fields: Field[]
}

const Inputs: FC<InputsProps> = ({ fields }) => {
  return (
    <div className='flex flex-col gap-4'>
      {fields.map((field) => {
        const r = fieldComponents[field.type] as FC<Field>
        if (!r) return (
          <fieldComponents.dummy {...field} />
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
