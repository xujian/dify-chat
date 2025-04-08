
export type Citation = {
  id: string
  title: string
  url: string
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

export type ThoughtItem = {
  id: string
  text: string
}

export type TransferMethod = 'all' | 'local_file' | 'remote_url'

export type File = {
  id?: string
  type: string
  transfer_method: TransferMethod
  url: string
  upload_file_id: string
  belongs_to?: string
}

export type Message = {
  id: string
  content: string
  citations?: Citation[]
  /**
   * Specific message type
   */
  type: MessageType
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
  agent_thoughts?: ThoughtItem[]
  message_files?: File[]
}