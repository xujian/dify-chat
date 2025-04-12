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
  maxLength?: number
  options?: string[] | LabelValuePair[]
}
