import type { FC } from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CircleX } from 'lucide-react'
import { RefreshCcw } from 'lucide-react'
import { AlertTriangle } from 'lucide-react'
import type { Media, Upload } from '@/models'
import ImagePreview from '@/components/upload/image-preview'
import { LoaderCircle } from 'lucide-react'

type FileListProps = {
  data: Upload[]
  deletable?: boolean
  onRemove?: (file: Upload) => void
  onReUpload?: (file: Upload) => void
  onImageLoad?: (file: Upload) => void
  onImageError?: (file: Upload) => void
}

const FileList: FC<FileListProps> = ({
  data,
  deletable,
  onRemove,
  onReUpload,
  onImageLoad,
  onImageError,
}) => {
  const { t } = useTranslation()
  const [previewUrl, setPreviewUrl] = useState('')

  const handleImageLoad = (item: Upload) => {
    if (item.transferMethod === 'remote' && onImageLoad && item.progress !== -1)
      onImageLoad(item)
  }
  const handleImageError = (item: Upload) => {
    if (item.transferMethod === 'remote' && onImageError)
      onImageError(item)
  }

  const onClick = (item: Upload) => {
    if (!item.url)
      return
    if (item.type === 'image') {
      if (item.progress === void 0 || item.progress === 100) {
        setPreviewUrl(item.url)
        return
      }
    }
    else if (['pdf', 'doc', 'xls', 'ppt', 'video', 'audio'].includes(item.type)) {
      window.open(item.url, '_blank')
    }
  }

  return (
    <div className='flex flex-row flex-wrap gap-2 p-2'>
      {
        data.map((item, index) => (
          <div
            key={index}
            className='group bg-gray-100 rounded-md relative'>
            {
              item.transferMethod === 'local' && item.progress !== 100 && (
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
              item.transferMethod === 'remote' && item.progress !== 100 && (
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
            {item.type === 'image' && <img
              className={[
                'w-16 h-16 rounded-md object-cover cursor-pointer border',
                item.type === 'image' ? 'thumbnail' : 'file-icon'
              ].join(' ')}
              alt=''
              onLoad={() => { console.log('ooooooo'); handleImageLoad(item) }}
              onError={() => handleImageError(item)}
              src={item.type === 'image'
                ? item.url
                : `/icons/${item.type}.png`}
              onClick={() => onClick(item)}
            />}
            {item.type !== 'image' && (
              <div className={[
                'w-16 h-16 rounded-md cursor-pointer border',
                'bg-gray-100 bg-no-repeat bg-center bg-size-[50%]'
              ].join(' ')}
                style={{ backgroundImage: `url(/icons/${item.type}.png)` }}
                title={item.name}
                onClick={() => onClick(item)}>
              </div>
            )}
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
        previewUrl && (
          <ImagePreview
            url={previewUrl}
            onCancel={() => setPreviewUrl('')}
          />
        )
      }
    </div>
  )
}

export default FileList
