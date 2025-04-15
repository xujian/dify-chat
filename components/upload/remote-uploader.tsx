import type { FC } from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Input } from '@/components/ui'
import type { UploadedFile } from '@/models'

type RemoteUploaderProps = {
  onUpload: (imageFile: UploadedFile) => void
}
const regex = /^(https?|ftp):\/\//

const RemoteUploader: FC<RemoteUploaderProps> = ({
  onUpload,
}) => {
  const { t } = useTranslation()
  const [imageLink, setImageLink] = useState('')

  const handleClick = () => {
    const imageFile = {
      type: 'local',
      id: `${Date.now()}`,
      fileId: '',
      progress: regex.test(imageLink) ? 0 : -1,
      url: imageLink,
    }
    onUpload(imageFile)
  }

  return (
    <div className='flex items-center h-8 relative'>
      <Input
        className='px-1 border w-full h-full text-[12px]'
        value={imageLink}
        onChange={e => setImageLink(e.target.value)}
        placeholder={t('common.imageUploader.pasteImageLinkInputPlaceholder') || ''}
      />
      <Button
        className='absolute right-0 h-8 text-xs font-medium'
        disabled={!imageLink}
        onClick={handleClick}
      >
        {t('common.operation.ok')}
      </Button>
    </div>
  )
}

export default RemoteUploader
