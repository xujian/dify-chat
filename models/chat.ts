import { WorkflowRunningStatus } from '@/types/app'
import { WorkflowProcess } from './workflow'

export type Citation = {
  id: string
  title: string
  url: string
}

export type MessageFormat = 'text' | 'json'

export type LogAnnotation = {
  content: string
  account: {
    id: string
    name: string
    email: string
  }
  created_at: number
}

export type Annotation = {
  id: string
  authorName: string
  logAnnotation?: LogAnnotation
  created_at?: number
}

export type Feedback = {
  rating: MessageRating
  content?: string | null
}

export type More = {
  time: string
  tokens: number
  latency: number | string
}

export const MessageRatings = ['like', 'dislike', null] as const
export type MessageRating = typeof MessageRatings[number]

export const MessageTypes = ['question', 'answer'] as const
export type MessageType = typeof MessageTypes[number]

export type Thought = {
  id: string
  text: string,
  tool: string // plugin or dataset. May has multi.
  content: string
  input: string
  messageId: string
  observation: string
  position: number
  files?: File[]
}

export type TransferMethod = 'all' | 'local_file' | 'remote_url'

export type File = {
  id?: string
  type: string
  transferMethod: TransferMethod
  url: string
  uploadId: string
  belongsTo?: string
}

export type Message = {
  id: string
  content: string
  citations?: Citation[]
  /**
   * Specific message type
   */
  type: MessageType
  format?: MessageFormat
  customContent?: Record<string, any>
  /**
   * The user feedback result of this message
   */
  feedback?: Feedback
  /**
   * The admin feedback result of this message
   */
  adminFeedback?: Feedback
  /**
   * Whether to hide the feedback area
   */
  feedbackDisabled?: boolean
  /**
   * More information about this message
   */
  more?: More
  annotation?: Annotation
  useCurrentUserAvatar?: boolean
  isOpeningStatement?: boolean
  suggestedQuestions?: string[]
  log?: { role: string; text: string }[]
  thoughts?: Thought[]
  files?: File[]
  workflowProcess?: WorkflowProcess
  workflowRunId?: string
}