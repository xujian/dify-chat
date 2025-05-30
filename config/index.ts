import type { AppInfo } from '@/models'
export const APP_ID = `${process.env.NEXT_PUBLIC_APP_ID}`
export const API_KEY = `${process.env.NEXT_PUBLIC_APP_KEY}`
export const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`
export const APP_INFO: AppInfo = {
  title: '智慧客户专员',
  description: '',
  copyright: '',
  privacyPolicy: '',
  defaultLanguage: 'zh-Hans',
  server: `${process.env.NEXT_PUBLIC_API_URL}`.replace('/v1', ''),
  useHistory: false,
  useWorkflow: false,
  useWelcome: false,
  useSearch: false,
  useSuggestions: false,
}

// export const isShowPrompt = false
// export const promptTemplate = 'I want you to act as a javascript console.'

export const API_PREFIX = '/api'

export const LOCALE_COOKIE_NAME = 'locale'

export const DEFAULT_VALUE_MAX_LEN = 48

export const APP_VERSION = '1.0.0'