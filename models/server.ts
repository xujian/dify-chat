import { Variable } from './app'

export type FileUpload = {
  enabled: boolean
}

export type SystemParameters = {
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
  systemParameters: SystemParameters
  variables: Variable[]
  annotationReply?: AnnotationReply
  suggests?: Suggest[]
}