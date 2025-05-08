import { Variable } from './form'

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

export type Suggest = {
  text: string
}

export interface ServerConfig {
  openingStatement: string
  upload: FileUpload
  variables: Variable[]
  annotationReply?: AnnotationReply
  suggests?: Suggest[]
}