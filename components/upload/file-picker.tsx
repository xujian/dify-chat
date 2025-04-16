'use client'

import type { ChangeEvent, FC, JSX } from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { uploadFile } from './utils'
import type { UploadedFile } from '@/models'
import { toast } from '@/components/toast'
import { upload } from '@/service/base'

type FilePickerProps = {
  children: (hovering: boolean) => JSX.Element
  onUpload: (file: UploadedFile) => void
  limit?: number
  disabled?: boolean
}

const FilePicker: FC<FilePickerProps> = ({
  children,
  onUpload,
  limit,
  disabled,
}) => {
  const [hovering, setHovering] = useState(false)
  // const { notify } = Toast
  const { t } = useTranslation()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const blob = e.target.files?.[0]
    if (!blob)
      return
    if (limit && blob.size > limit * 1024 * 1024) {
      toast({ type: 'error', message: t('common.imageUploader.uploadFromComputerLimit', { size: limit }) })
      return
    }
    const reader = new FileReader()
    reader.addEventListener(
      'load',
      () => {
        const uploaded: UploadedFile = {
          id: `${Date.now()}`,
          uploadId: '',
          blob,
          url: reader.result as string,
          progress: 0,
          transferMethod: 'local',
          type: 'image',
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
            blob,
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
      className='relative'
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {children(hovering)}
      <input
        className={`
          absolute block inset-0 opacity-0 text-[0] w-full
          ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
        `}
        onClick={e => (e.target as HTMLInputElement).value = ''}
        type='file'
        accept='.png, .jpg, .jpeg, .webp, .gif'
        onChange={handleChange}
        disabled={disabled}
      />
    </div>
  )
}

export default FilePicker
