import { Thought, Media } from '@/models'

export const sortAgentSorts = (list: Thought[]) => {
  if (!list)
    return list
  if (list.some(item => item.position === undefined))
    return list
  const temp = [...list]
  temp.sort((a, b) => a.position - b.position)
  return temp
}

export const addFileInfos = (
  list: Thought[],
  messageFiles: Media[]) => {
  if (!list || !messageFiles)
    return list
  return list.map((item) => {
    if (item.files && item.files?.length > 0) {
      return {
        ...item,
        message_files: item.files.map(fileId =>
          messageFiles.find(file => file.id === fileId) as Media) as Media[],
      }
    }
    return item
  })
}
