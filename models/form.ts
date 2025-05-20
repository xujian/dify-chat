import { Variable } from './variables'

export type LabelValuePair = {
  label: string
  value: string
}

/**
 * Form Block Field
 */
export type Field = Variable & {
  default?: string | number
  maxLength?: number
  options?: string[] | LabelValuePair[]
  onChange?: (value: string) => void
}
