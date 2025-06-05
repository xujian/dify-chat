
/**
 * 参数来源
 */
export type VariableOrigin =
  /**
   * Given value from url query string
   */
  'url' |
  /**
   * 
   */
  'session'

export type Variable = {
  name: string
  value: string
  required?: boolean
  length?: number
  type: string,
  origin?: VariableOrigin
}

export type TextTypeFormItem = {
  label: string
  variable: string
  required: boolean
  max_length: number
}

export type SelectTypeFormItem = {
  label: string
  variable: string
  required: boolean
  options: string[]
}
/**
 * User Input Form Item
 */
export type UserInputFormItem = {
  'text-input': TextTypeFormItem
} | {
  'select': SelectTypeFormItem
} | {
  'paragraph': TextTypeFormItem
}