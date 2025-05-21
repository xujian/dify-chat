import { Variable } from '@/models'

export type FileUpload = {
  enabled: boolean
  accept?: string[]
  allowedTransferMethods?: string[]
  sizeLimit?: number
  limit?: number
}

export type AnnotationReply = {
  enabled: boolean
}

export type Suggestion = {
  text: string
}

export interface ServerConfig {
  openingStatement: string
  upload: FileUpload
  variables: Variable[]
  annotationReply?: AnnotationReply
  suggestions?: Suggestion[]
}