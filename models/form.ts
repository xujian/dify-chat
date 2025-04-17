export type LabelValuePair = {
  label: string
  value: string
}

/**
 * Form Block Field
 */
export type Field = {
  name: string
  value: string
  label: string
  type: string
  required: boolean
  default?: string | number
  maxLength?: number
  options?: string[] | LabelValuePair[]
  onChange?: (value: string) => void
}

export type Variable = Field & {
  key: string
  type: string
}