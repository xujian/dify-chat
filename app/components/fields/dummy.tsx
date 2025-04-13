import { FC } from 'react'
import { Field } from '@/models'
import { Label } from '@/app/components/ui/label'
import { Input } from '@headlessui/react'

const Dummy: FC<Field> = (props) => {
  return <div className='flex flex-col gap-1'>
    <Label>{props.label}</Label>
    <Input type="text" name={props.name} />
  </div>
}

export default Dummy
