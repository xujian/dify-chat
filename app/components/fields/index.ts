import text from './text'
import select from './select'
import number from './number'
import dummy from './dummy'
import { FC } from 'react'
import { InputProps } from '@/models'

const fields: Record<string, FC<InputProps>> = {
  text, select, number, dummy
}

export default fields