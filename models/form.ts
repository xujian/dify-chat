export type LabelValuePair = {
  label: string
  value: string
}

/**
 * Form Block Field
 */
export type Field = {
  name: string
  label: string
  type: string
  required: boolean
  default?: string | number
  maxLength?: number
  options?: string[] | LabelValuePair[]
}

export type Variable = Field & {
  key: string
  type: string
}