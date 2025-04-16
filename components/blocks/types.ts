import { Field } from '@/models'

export type CustomBlockData = {
  type: 'form' | 'card'
  preset: string,
  fields: Field[]
}

export type CustomBlockProps = {
  data: CustomBlockData
}


