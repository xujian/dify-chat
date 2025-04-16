
export enum Resolution {
  low = 'low',
  high = 'high',
}

export type MediaSettings = {
  enabled: boolean
  limits: number
  detail: Resolution
  transferMethod: TransferMethod
  imageFileSizeLimit?: number | string
}

export type TransferMethod = 'all' | 'local' | 'remote'

export type Media = {
  id?: string
  type: string
  transferMethod?: TransferMethod
  url?: string
  uploadId?: string
}

export type UploadedFile = Media & {
  progress: number
  deleted?: boolean
  blob?: File
}