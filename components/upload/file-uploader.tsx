import type { FC } from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import FilePicker from './file-picker'
import RemoteUploader from './remote-uploader'
import { ImageUp } from 'lucide-react'
import type { UploadedFile } from '@/models'
import { Button } from '../ui'

type FileUploaderProps = {
  onUpload: (file: UploadedFile) => void
  disabled?: boolean
  limit?: number
  accept?: string[]
}
const FileUploader: FC<FileUploaderProps> = ({
  onUpload,
  disabled,
  limit,
  accept,
}) => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  const handleUpload = (file: UploadedFile) => {
    setOpen(false)
    onUpload(file)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button size="icon" variant="ghost" title='上传文件'>
          <ImageUp className='w-4 h-4' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='rounded-lg gap-4 flex flex-col'>
        <RemoteUploader onUpload={handleUpload} />
        <FilePicker
          onUpload={handleUpload}
          limit={limit}
          accept={accept}>
        </FilePicker>
      </PopoverContent>
    </Popover>
  )
}

export default FileUploader
