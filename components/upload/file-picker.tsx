'use client'

import type { ChangeEvent, FC, JSX } from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getTypeFromExtension, type MediaType, type Upload } from '@/models'
import { toast } from '@/components/toast'
import { upload } from '@/service/base'
import { CloudUpload } from 'lucide-react'

const extensionCategoryMapping: Record<string, string> = {
  'image': '.png, .jpg, .jpeg, .webp, .gif',
  'document': '.pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx',
  'video': '.mp4, .avi, .mov, .wmv, .flv, .mpeg, .mpg, .m4v, .webm, .mkv',
  'audio': '.mp3, .wav, .m4a, .ogg, .wma, .aac, .flac, .m4b, .m4p, .m4b, .m4p',
}

type FilePickerProps = {
  children?: (hovering: boolean) => JSX.Element
  onUpload: (file: Upload) => void
  limit?: number
  disabled?: boolean
  accept?: string[]
}

const FilePicker: FC<FilePickerProps> = ({
  children,
  onUpload,
  limit,
  disabled,
  accept,
}) => {
  const [hovering, setHovering] = useState(false)
  // const { notify } = Toast
  const { t } = useTranslation()

  const handleChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const [blob] = target.files!
    if (!blob)
      return
    const ext = blob.name.split('.').pop()
    const type = getTypeFromExtension(ext!)
    if (limit && blob.size > limit * 1024 * 1024) {
      toast({ type: 'error', message: t('common.imageUploader.uploadFromComputerLimit', { size: limit }) })
      return
    }
    const reader = new FileReader()
    reader.addEventListener(
      'load',
      () => {
        const uploaded: Upload = {
          id: `${Date.now()}`,
          uploadId: '',
          url: reader.result as string,
          progress: 0,
          transferMethod: 'local',
          type,
        }
        onUpload(uploaded)
        const formData = new FormData()
        formData.append('file', blob)
        upload({
          xhr: new XMLHttpRequest(),
          data: formData,
          onprogress: (progress: number) => {
            onUpload({ ...uploaded, progress })
          },
        }).then((res: { id: string }) => {
          onUpload({
            ...uploaded,
            progress: 100,
            uploadId: res.id,
          })
        }).catch(() => {
          onUpload({ ...uploaded, progress: -1 })
        })
      },
      false,
    )
    reader.addEventListener(
      'error',
      () => {
        //notify({ type: 'error', message: t('common.imageUploader.uploadFromComputerReadError') })
      },
      false,
    )
    reader.readAsDataURL(blob)
  }

  return (
    <div
      className={[
        'relative border-dashed border-2 text-xs',
        'flex flex-col items-center justify-center',
        'border-gray-200 rounded-md min-h-20',
        'cursor-pointer',
      ].join(' ')}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <input
        className={`
          absolute block inset-0 opacity-0 text-[0] w-full
          ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
        `}
        onClick={e => (e.target as HTMLInputElement).value = ''}
        type='file'
        accept={
          accept
            ? accept?.map(type => extensionCategoryMapping[type]).join(',')
            : ''
        }
        onChange={handleChange}
        disabled={disabled}
      />
      <CloudUpload className='w-4 h-4' />
      <h6>{t('common.imageUploader.uploadFromComputer')}</h6>
    </div>
  )
}

export default FilePicker
