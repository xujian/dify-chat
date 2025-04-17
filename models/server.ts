import { Variable } from './form'

export type FileUpload = {
  enabled: boolean
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