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

const getWidthStyle = (imgNum: number) => {
  if (imgNum === 1) {
    return {
      maxWidth: '100%',
    }
  }

  if (imgNum === 2 || imgNum === 4) {
    return {
      width: 'calc(50% - 4px)',
    }
  }

  return {
    width: 'calc(33.3333% - 5.3333px)',
  }
}

const ImageGallery: FC<Props> = ({
  items,
}) => {
  const [imagePreviewUrl, setImagePreviewUrl] = useState('')

  const imgNum = items.length
  const imgStyle = getWidthStyle(imgNum)
  return (
    <div className={cn(s[`img-${imgNum}`], 'flex flex-wrap')}>
      {/* TODO: support preview */}
      {items.map((file, index) => (
        <img
          key={index}
          className={s.item}
          style={imgStyle}
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

export const ImageGalleryTest = () => {
  const imgGallerySrcs = (() => {
    const srcs = []
    for (let i = 0; i < 6; i++)
      // srcs.push('https://placekitten.com/640/360')
      // srcs.push('https://placekitten.com/360/640')
      srcs.push('https://placekitten.com/360/360')

    return srcs
  })()
  return (
    <div className='space-y-2'>
      {imgGallerySrcs.map((_, index) => (
        <div key={index} className='p-4 pb-2 rounded-lg bg-[#D1E9FF80]'>
          <ImageGallery items={imgGallerySrcs.slice(0, index + 1)} />
        </div>
      ))}
    </div>
  )
}
