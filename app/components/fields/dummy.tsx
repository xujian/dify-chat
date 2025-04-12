import { FC } from 'react'
import { InputProps } from '@/models'
import { Label } from '@/app/components/ui/label'
import { Input } from '@headlessui/react'

const Dummy: FC<InputProps> = (props) => {
  return <div className='flex flex-col gap-1'>
    <Label>{props.label}</Label>
    <Input type="text" name={props.name} />
  </div>
}

export default Dummy
