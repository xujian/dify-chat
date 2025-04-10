import { FC } from 'react'
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { InputProps, Variable } from '@/models'

const text: FC<InputProps> = (props) => {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label>{props.label}</Label>
      <Input name={props.name} />
    </div>
  )
}

const select: FC<InputProps> = (props) => {
  return <div>{props.name}</div>
}

const number: FC<InputProps> = (props) => {
  return <div>{props.name}</div>
}

const inputs: Record<string, FC<InputProps>> = {
  text,
  select,
  number,
}

export type InputsProps = {
  fields: Variable[]
}

const Inputs: FC<InputsProps> = ({ fields }) => {
  return (
    <div className='flex flex-col gap-4'>
      {
        fields.map((field) => {
          const r = inputs[field.type as keyof typeof inputs]
          if (!r) return null;
          return (
            <div key={field.name}>
              {r(field)}
            </div>
          )
        })
      }
    </div>
  )
}

export default Inputs
