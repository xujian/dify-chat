import type { Locale } from '@/i18n'

export type AppInfo = {
  title: string
  description: string
  defaultLanguage: Locale
  copyright?: string
  privacyPolicy?: string
}

export type PromptVariable = {
  key: string
  name: string
  type: string
  default?: string | number
  options?: string[]
  maxLength?: number
  required: boolean
}

export type TypeWithI18N<T = string> = {
  'en_US': T
  'zh_Hans': T
  [key: string]: T
}
