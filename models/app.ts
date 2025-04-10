import type { Locale } from '@/i18n'

export type AppInfo = {
  title: string
  description: string
  default_language: Locale
  copyright?: string
  privacy_policy?: string
}

export type PromptVariable = {
  key: string
  name: string
  type: string
  default?: string | number
  options?: string[]
  max_length?: number
  required: boolean
}

export type PromptConfig = {
  template: string
  variables: PromptVariable[]
}