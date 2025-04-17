import { FC, useState, useEffect } from 'react'
import fieldComponents from '@/components/fields'
import type { Field } from '@/models'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '@/store'
import { setVariable } from '@/store/session'
import { useVariables } from '@/hooks/use-variables'
export type InputsProps = {
  fields: Field[]
}

const Inputs: FC<InputsProps> = ({ fields }) => {
  const session = useSelector((state: RootState) => state.session)
  const dispatch = useDispatch()
  return (
    <div className='flex flex-col gap-4'>
      {fields
        .filter((field) => field.name !== 'user_id')
        .map((field) => {
          const r = fieldComponents[field.type] as FC<Field>
          if (!r) return (
            <fieldComponents.dummy key={field.name} {...field} />
          )
          const Component: FC = () => r({
            ...field,
            value: session.variables[field.name] || '',
            onChange: (value: string) => {
              dispatch(setVariable({ name: field.name, value }))
            }
          })
          return (
            <div key={field.name}>
              <Component />
            </div>
          )
        })}
    </div>
  )
}

export default Inputs
