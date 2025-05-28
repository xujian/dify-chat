
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

export type MediaCategory = 'image' | 'document' | 'video' | 'audio'

export type MediaType = 'image' | 'pdf' | 'doc' | 'xls' | 'ppt' | 'video' | 'audio'

export type TransferMethod = 'all' | 'local' | 'remote'

export type Media = {
  id?: string
  type: MediaType
  name?: string
  size?: number
  transferMethod?: TransferMethod
  url?: string
  blob?: File
  category?: MediaCategory
}

export type Upload = Media & {
  progress: number
  deleted?: boolean
  uploadId?: string
}

export const extensionTypeMapping: Record<string, MediaType> = {
  'png': 'image',
  'jpg': 'image',
  'jpeg': 'image',
  'webp': 'image',
  'gif': 'image',
  'pdf': 'pdf',
  'doc': 'doc',
  'docx': 'doc',
  'xls': 'xls',
  'xlsx': 'xls',
  'ppt': 'ppt',
  'pptx': 'ppt',
  'mp4': 'video',
  'avi': 'video',
  'mov': 'video',
  'wmv': 'video',
  'mp3': 'audio',
  'wav': 'audio',
  'm4a': 'audio',
  'ogg': 'audio',
  'wma': 'audio',
  'aac': 'audio',
}

export const typeCategoryMapping: Record<MediaType, MediaCategory> = {
  'image': 'image',
  'pdf': 'document',
  'doc': 'document',
  'xls': 'document',
  'ppt': 'document',
  'video': 'video',
  'audio': 'audio',
}

export const getTypeFromExtension = (extension: string): MediaType => {
  return extensionTypeMapping[extension]
}

export const getCategoryFromType = (type: MediaType): MediaCategory => {
  return typeCategoryMapping[type]
}

export const regulateFileType = (name: string): MediaType => {
  const extension = name.split('.').pop()
  return getTypeFromExtension(extension!)
}