import { FC, useState, useEffect } from 'react'
import { InputProps, Variable } from '@/models'
import fieldComponents from '@/app/components/fields'

export type InputsProps = {
  fields: Variable[]
}

const Inputs: FC<InputsProps> = ({ fields }) => {
  return (
    <div className='flex flex-col gap-4'>
      {fields.map((field) => {
        const r = fieldComponents[field.type] as FC<InputProps>
        if (!r) return (
          <fieldComponents.dummy {...field} />
        )
        const Component = () => r(field)
        return (
          <Component />
        )
      })}
    </div>
  )
}

export default Inputs
