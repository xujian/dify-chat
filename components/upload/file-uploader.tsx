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
import { ImageUp, CloudUpload } from 'lucide-react'
import { Resolution, TransferMethod } from '@/models'
import type { UploadedFile, MediaSettings } from '@/models'

type UploadOnlyFromLocalProps = {
  onUpload: (file: UploadedFile) => void
  disabled?: boolean
  limit?: number
}
const LocalUpload: FC<UploadOnlyFromLocalProps> = ({
  onUpload,
  disabled,
  limit,
}) => {
  return (
    <FilePicker
      onUpload={onUpload}
      disabled={disabled}
      limit={limit}>
      {
        hovering => (
          <div className={[
            'relative',
            'flex',
            'items-center',
            'justify-center',
            'w-8',
            'h-8',
            'rounded-lg',
            'cursor-pointer',
            hovering ? 'bg-gray-100' : ''
          ].filter(Boolean).join(' ')}>
            <ImageUp className='w-4 h-4 text-gray-500' />
          </div>
        )
      }
    </FilePicker>
  )
}

type UploaderButtonProps = {
  method: MediaSettings['transferMethod']
  onUpload: (file: UploadedFile) => void
  disabled?: boolean
  limit?: number
}
const UploaderButton: FC<UploaderButtonProps> = ({
  method,
  onUpload,
  disabled,
  limit,
}) => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  const handleUpload = (file: UploadedFile) => {
    setOpen(false)
    onUpload(file)
  }

  const handleToggle = () => {
    if (disabled)
      return
    setOpen(v => !v)
  }

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}>
      <PopoverTrigger onClick={handleToggle}>
        <div className={`
          relative flex items-center justify-center w-8 h-8 hover:bg-gray-100 rounded-md
          ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
        `}>
          <ImageUp className='w-4 h-4 text-gray-500' />
        </div>
      </PopoverTrigger>
      <PopoverContent className='z-50'>
        <RemoteUploader onUpload={handleUpload} />
        <div className='bg-white mt-2'>
          {
            method === 'local' && (
              <FilePicker
                onUpload={handleUpload}
                limit={limit}>
                {
                  hovering => (
                    <div className={`
                        flex items-center justify-center h-8 text-[13px] font-medium text-[#155EEF] rounded-lg cursor-pointer
                        ${hovering && 'bg-primary-50'}
                      `}>
                      <CloudUpload className='mr-1 w-4 h-4' />
                      {t('common.imageUploader.uploadFromComputer')}
                    </div>
                  )
                }
              </FilePicker>
            )
          }
        </div>
      </PopoverContent>
    </Popover>
  )
}

type FileUploaderProps = {
  settings?: MediaSettings
  onUpload: (file: UploadedFile) => void
  disabled?: boolean
}

const defaultSettings: MediaSettings = {
  enabled: true,
  limits: 10,
  detail: Resolution.high,
  transferMethod: 'all',
  imageFileSizeLimit: 10
}

const FileUploader: FC<FileUploaderProps> = ({
  settings = defaultSettings,
  onUpload,
  disabled,
}) => {
  if (settings.transferMethod === 'local') {
    return (
      <LocalUpload
        onUpload={onUpload}
        disabled={disabled}
        limit={+settings.imageFileSizeLimit!}
      />
    )
  }

  return (
    <UploaderButton
      method='local'
      onUpload={onUpload}
      disabled={disabled}
      limit={+settings.imageFileSizeLimit!}
    />
  )
}

export default FileUploader
