import type { FC } from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Input } from '@/components/ui'
import type { UploadedFile } from '@/models'
import { toast } from '@/components'

type RemoteUploaderProps = {
  onUpload: (imageFile: UploadedFile) => void
}
const regex = /^(https?):\/\//

const RemoteUploader: FC<RemoteUploaderProps> = ({
  onUpload,
}) => {
  const { t } = useTranslation()
  const [url, setUrl] = useState('')

  const handleClick = () => {
    if (!url) return
    if (!regex.test(url)) {
      toast({
        type: 'error',
        message: '格式不对'
      })
      return
    }
    const uploaded: UploadedFile = {
      type: 'image',
      id: `${Date.now()}`,
      progress: 0,
      url,
      transferMethod: 'remote'
    }
    onUpload(uploaded)
  }

  return (
    <div className='flex items-center h-8 relative'>
      <Input
        className='px-1 border w-full h-full focus:outline-none'
        value={url}
        onChange={e => setUrl(e.target.value)}
        placeholder={t('common.imageUploader.pasteImageLinkInputPlaceholder') || ''}
      />
      <Button
        className='absolute right-0 h-8 text-xs font-medium'
        disabled={!url}
        onClick={handleClick}
      >
        {t('common.operation.ok')}
      </Button>
    </div>
  )
}

export default RemoteUploader
