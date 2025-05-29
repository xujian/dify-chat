import React, { useMemo } from 'react'

import { Button } from '@/components/ui/button'
import { Field } from '@/models'
import Inputs from '../inputs'
import presets from './forms'
import { CustomBlockData, CustomBlockProps } from './types'

const FormBlock: React.FC<CustomBlockProps> = ({ data }) => {

  function onSubmit() {

  }

  const Component = useMemo(() => {
    return data.preset in presets
      ? presets[data.preset]
      : null
  }, [data.preset])

  return (
    <form className='flex flex-col gap-1 space-y-4'>
      {Component
        ? <Component data={data} />
        : <Inputs fields={data.fields} />
      }
      <Button type="submit" className='bg-primary text-primary-foreground max-w-sm'>提交</Button>
    </form>
  )
}

export default FormBlock