'use client'
import type { FC } from 'react'
import React, { useState } from 'react'
import cn from 'classnames'
import s from './image-gallery.module.css'
import ImagePreview from '@/components/upload/image-preview'
import { Media } from '@/models'

type Props = {
  items: Media[]
}

const ImageGallery: FC<Props> = ({
  items,
}) => {
  const [imagePreviewUrl, setImagePreviewUrl] = useState('')

  const imgNum = items.length
  return (
    <div className={cn(s['image-gallery'], 'flex flex-wrap gap-1 mb-2')}>
      {/* TODO: support preview */}
      {items.map((file, index) => (
        <img
          key={index}
          className={s.item}
          src={file.url}
          alt=''
          onClick={() => setImagePreviewUrl(file.url!)}
        />
      ))}
      {
        imagePreviewUrl && (
          <ImagePreview
            url={imagePreviewUrl}
            onCancel={() => setImagePreviewUrl('')}
          />
        )
      }
    </div>
  )
}

export default React.memo(ImageGallery)
