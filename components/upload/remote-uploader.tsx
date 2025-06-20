import type { FC } from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Input } from '@/components/ui'
import type { Upload } from '@/models'
import { toast } from '@/components'

type RemoteUploaderProps = {
  onUpload: (imageFile: Upload) => void
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
    const uploaded: Upload = {
      type: 'image',
      id: `${Date.now()}`,
      progress: 0,
      url,
      transferMethod: 'remote'
    }
    onUpload(uploaded)
  }

  return (
    <div className='flex items-center h-7 relative'>
      <Input
        className='px-1 border w-full h-7 text-xs rounded-md'
        value={url}
        onChange={e => setUrl(e.target.value)}
        placeholder={t('common.imageUploader.pasteImageLinkInputPlaceholder') || ''}
      />
      <Button
        className='absolute right-0 h-7 text-xs'
        disabled={!url}
        onClick={handleClick}
      >
        {t('common.operation.ok')}
      </Button>
    </div>
  )
}

export default RemoteUploader
