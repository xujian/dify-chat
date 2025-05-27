import type { FC } from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CircleX } from 'lucide-react'
import { RefreshCcw } from 'lucide-react'
import { AlertTriangle } from 'lucide-react'
import type { UploadedFile } from '@/models'
import ImagePreview from '@/components/upload/image-preview'
import { LoaderCircle } from 'lucide-react'

type ImageListProps = {
  list: UploadedFile[]
  deletable?: boolean
  onRemove?: (file: UploadedFile) => void
  onReUpload?: (file: UploadedFile) => void
  onImageLoad?: (file: UploadedFile) => void
  onImageError?: (file: UploadedFile) => void
}

const ImageList: FC<ImageListProps> = ({
  list,
  deletable,
  onRemove,
  onReUpload,
  onImageLoad,
  onImageError,
}) => {
  const { t } = useTranslation()
  const [imagePreviewUrl, setImagePreviewUrl] = useState('')

  const handleImageLoad = (item: UploadedFile) => {
    if (item.type === 'remote' && onImageLoad && item.progress !== -1)
      onImageLoad(item)
  }
  const handleImageError = (item: UploadedFile) => {
    if (item.type === 'remote' && onImageError)
      onImageError(item)
  }

  return (
    <div className='flex flex-row flex-wrap p-2 -mb-2'>
      {
        list.map((item, index) => (
          <div
            key={index}
            className='group relative mr-1'>
            {
              item.type === 'local' && item.progress !== 100 && (
                <>
                  <div
                    className='absolute inset-0 flex items-center justify-center z-1 bg-black/30'
                    style={{ left: item.progress > -1 ? `${item.progress}%` : 0 }}>
                    {
                      item.progress === -1 && (
                        <RefreshCcw className='w-5 h-5 text-white' onClick={() => onReUpload && onReUpload(item.id)} />
                      )
                    }
                  </div>
                  {
                    item.progress > -1 && (
                      <span className='absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-sm text-white mix-blend-lighten z-1'>{item.progress}%</span>
                    )
                  }
                </>
              )
            }
            {
              item.type === 'remote' && item.progress !== 100 && (
                <div className={[
                  'absolute inset-0 flex items-center justify-center rounded-lg z-1 border',
                  item.progress === -1 ? 'bg-[#FEF0C7] border-[#DC6803]' : 'bg-black/[0.16] border-transparent'
                ].join(' ')}>
                  {
                    item.progress > -1 && (
                      <LoaderCircle className='animate-spin w-5 h-5 text-white' />
                    )
                  }
                  {
                    item.progress === -1 && (
                      <AlertTriangle className='w-4 h-4 text-[#DC6803]' />
                    )
                  }
                </div>
              )
            }
            <img
              className='w-16 h-16 rounded-md object-cover cursor-pointer border'
              alt=''
              onLoad={() => { console.log('ooooooo'); handleImageLoad(item) }}
              onError={() => handleImageError(item)}
              src={item.url}
              onClick={() => item.progress === 100 && setImagePreviewUrl(item.url!)}
            />
            {
              deletable !== false && (
                <div
                  className={[
                    'absolute z-10 top-0 right-0 flex items-center justify-center w-6 h-6',
                    'hover:bg-gray-50 rounded-2xl',
                    'cursor-pointer',
                    item.progress === -1 ? 'flex' : 'group-hover:flex'
                  ].join(' ')}
                  onClick={() => onRemove && onRemove(item)}>
                  <CircleX className='w-4 h-4 bg-white text-gray-500 rounded-2xl' />
                </div>
              )
            }
          </div>
        ))
      }
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

export default ImageList
