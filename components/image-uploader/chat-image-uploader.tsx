import type { FC } from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Uploader from './uploader'
import ImageLinkInput from './image-link-input'
import { ImageUp, CloudUpload } from 'lucide-react'
import { Resolution, TransferMethod } from '@/models'
import {
  PortalToFollowElem,
  PortalToFollowElemContent,
  PortalToFollowElemTrigger,
} from './portal'
import type { ImageFile, MediaSettings } from '@/models'

type UploadOnlyFromLocalProps = {
  onUpload: (imageFile: ImageFile) => void
  disabled?: boolean
  limit?: number
}
const UploadOnlyFromLocal: FC<UploadOnlyFromLocalProps> = ({
  onUpload,
  disabled,
  limit,
}) => {
  return (
    <Uploader onUpload={onUpload} disabled={disabled} limit={limit}>
      {
        hovering => (
          <div className={`
            relative flex items-center justify-center w-8 h-8 rounded-lg cursor-pointer
            ${hovering && 'bg-gray-100'}
          `}>
            <ImageUp className='w-4 h-4 text-gray-500' />
          </div>
        )
      }
    </Uploader>
  )
}

type UploaderButtonProps = {
  method: MediaSettings['transferMethod']
  onUpload: (imageFile: ImageFile) => void
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

  const handleUpload = (imageFile: ImageFile) => {
    setOpen(false)
    onUpload(imageFile)
  }

  const handleToggle = () => {
    if (disabled)
      return

    setOpen(v => !v)
  }

  return (
    <PortalToFollowElem
      open={open}
      onOpenChange={setOpen}
      placement='top-start'
    >
      <PortalToFollowElemTrigger onClick={handleToggle}>
        <div className={`
          relative flex items-center justify-center w-8 h-8 hover:bg-gray-100 rounded-lg
          ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
        `}>
          <ImageUp className='w-4 h-4 text-gray-500' />
        </div>
      </PortalToFollowElemTrigger>
      <PortalToFollowElemContent className='z-50'>
        <div className='p-2 w-[260px] bg-white rounded-lg border-[0.5px] border-gray-200 shadow-lg'>
          <ImageLinkInput onUpload={handleUpload} />
          {
            method === 'local' && (
              <>
                <div className='flex items-center mt-2 px-2 text-xs font-medium text-gray-400'>
                  <div className='mr-3 w-[93px] h-[1px] bg-linear-to-l from-[#F3F4F6]' />
                  OR
                  <div className='ml-3 w-[93px] h-[1px] bg-linear-to-r from-[#F3F4F6]' />
                </div>
                <Uploader onUpload={handleUpload} limit={limit}>
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
                </Uploader>
              </>
            )
          }
        </div>
      </PortalToFollowElemContent>
    </PortalToFollowElem>
  )
}

type ChatImageUploaderProps = {
  settings?: MediaSettings
  onUpload: (imageFile: ImageFile) => void
  disabled?: boolean
}

const defaultSettings: MediaSettings = {
  enabled: true,
  limits: 10,
  detail: Resolution.high,
  transferMethod: 'all',
  imageFileSizeLimit: 10
}

const ChatImageUploader: FC<ChatImageUploaderProps> = ({
  settings = defaultSettings,
  onUpload,
  disabled,
}) => {
  console.log('ChatImageUploader, settings', settings)
  if (settings.transferMethod === 'local') {
    return (
      <UploadOnlyFromLocal
        onUpload={onUpload}
        disabled={disabled}
        limit={+settings.imageFileSizeLimit!}
      />
    )
  }

  return (
    <UploaderButton
      method="local"
      onUpload={onUpload}
      disabled={disabled}
      limit={+settings.imageFileSizeLimit!}
    />
  )
}

export default ChatImageUploader
