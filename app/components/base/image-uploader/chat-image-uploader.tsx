import type { FC } from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Uploader from './uploader'
import ImageLinkInput from './image-link-input'
import ImagePlus from '@/app/components/base/icons/line/image-plus'
import { Resolution, TransferMethod } from '@/models'
import {
  PortalToFollowElem,
  PortalToFollowElemContent,
  PortalToFollowElemTrigger,
} from '@/app/components/base/portal-to-follow-elem'
import Upload03 from '@/app/components/base/icons/line/upload-03'
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
            <ImagePlus className='w-4 h-4 text-gray-500' />
          </div>
        )
      }
    </Uploader>
  )
}

type UploaderButtonProps = {
  methods: MediaSettings['transferMethods']
  onUpload: (imageFile: ImageFile) => void
  disabled?: boolean
  limit?: number
}
const UploaderButton: FC<UploaderButtonProps> = ({
  methods,
  onUpload,
  disabled,
  limit,
}) => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  const hasUploadFromLocal = methods.find(method => method === 'local')

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
          <ImagePlus className='w-4 h-4 text-gray-500' />
        </div>
      </PortalToFollowElemTrigger>
      <PortalToFollowElemContent className='z-50'>
        <div className='p-2 w-[260px] bg-white rounded-lg border-[0.5px] border-gray-200 shadow-lg'>
          <ImageLinkInput onUpload={handleUpload} />
          {
            hasUploadFromLocal && (
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
                        <Upload03 className='mr-1 w-4 h-4' />
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
  transferMethods: ['all'],
  imageFileSizeLimit: 10
}

const ChatImageUploader: FC<ChatImageUploaderProps> = ({
  settings = defaultSettings,
  onUpload,
  disabled,
}) => {
  const onlyUploadLocal = settings.transferMethods.length === 1
    && settings.transferMethods[0] === 'local'

  if (onlyUploadLocal) {
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
      methods={settings.transferMethods}
      onUpload={onUpload}
      disabled={disabled}
      limit={+settings.imageFileSizeLimit!}
    />
  )
}

export default ChatImageUploader
