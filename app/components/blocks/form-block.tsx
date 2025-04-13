import React from 'react'

import { Button } from '@/app/components/ui/button'
import { Field } from '@/models'
import Inputs from '../inputs'
interface FormProps {
  fields: Field[]
}

const FormBlock: React.FC<FormProps> = ({ fields }) => {

  function onSubmit() {

  }

  return (
    <form className='flex flex-col gap-1 space-y-4'>
      <Inputs fields={fields} />
      <Button type="submit">提交</Button>
    </form>
  )
}

export default FormBlock