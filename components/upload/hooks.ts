import { useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Upload } from '@/models'
import { toast } from '../toast'
import { upload } from '@/service/base'

export const useUploadedFiles = () => {
  const { t } = useTranslation()
  const [files, setFiles] = useState<Upload[]>([])
  const filesRef = useRef<Upload[]>([])

  const handleUpload = (file: Upload) => {
    const files = filesRef.current
    const index = files.findIndex(f => f.id === file.id)

    if (index > -1) {
      const currentFile = files[index]
      const newFiles = [
        ...files.slice(0, index),
        { ...currentFile, ...file },
        ...files.slice(index + 1)
      ]
      setFiles(newFiles)
      filesRef.current = newFiles
    }
    else {
      const newFiles = [...files, file]
      setFiles(newFiles)
      filesRef.current = newFiles
    }
  }
  const handleRemove = (file: Upload) => {
    const files = filesRef.current
    const index = files.findIndex(f => f.id === file.id)

    if (index > -1) {
      const currentFile = files[index]
      const newFiles = [
        ...files.slice(0, index),
        {
          ...currentFile, deleted: true
        },
        ...files.slice(index + 1)
      ]
      setFiles(newFiles)
      filesRef.current = newFiles
    }
  }
  const onImageError = (file: Upload) => {
    const files = filesRef.current
    const index = files.findIndex(f => f.id === file.id)

    if (index > -1) {
      const currentFile = files[index]
      const newFiles = [
        ...files.slice(0, index),
        { ...currentFile, progress: -1 },
        ...files.slice(index + 1)
      ]
      filesRef.current = newFiles
      setFiles(newFiles)
    }
  }
  const onImageLoad = (file: Upload) => {
    const files = filesRef.current
    const index = files.findIndex(f => f.id === file.id)

    if (index > -1) {
      const currentImageFile = files[index]
      const newFiles = [
        ...files.slice(0, index),
        { ...currentImageFile, progress: 100 },
        ...files.slice(index + 1)
      ]
      filesRef.current = newFiles
      setFiles(newFiles)
    }
  }
  const handleReUpload = (file: Upload) => {
    const files = filesRef.current
    const index = files.findIndex(f => f.id === file.id)

    if (index > -1) {
      const currentImageFile = files[index]
      const formData = new FormData()
      formData.append('file', currentImageFile.file!)
      upload({
        xhr: new XMLHttpRequest(),
        data: formData,
        onprogress: (progress: number) => {
          const newFiles = [
            ...files.slice(0, index),
            { ...currentImageFile, progress },
            ...files.slice(index + 1)
          ]
          filesRef.current = newFiles
          setFiles(newFiles)
        },
      }).then((res: { id: string }) => {
        const newFiles = [
          ...files.slice(0, index),
          { ...currentImageFile, fileId: res.id, progress: 100 },
          ...files.slice(index + 1)
        ]
        filesRef.current = newFiles
        setFiles(newFiles)
      }).catch(() => {
        toast({
          type: 'error',
          message: t('common.imageUploader.uploadFromComputerUploadError')
        })
        const newFiles = [
          ...files.slice(0, index),
          { ...currentImageFile, progress: -1 },
          ...files.slice(index + 1)
        ]
        filesRef.current = newFiles
        setFiles(newFiles)
      })
    }
  }

  const handleClear = () => {
    setFiles([])
    filesRef.current = []
  }

  const filteredFiles = useMemo(() => {
    return files.filter(file => !file.deleted)
  }, [files])

  return {
    files: filteredFiles,
    onUpload: handleUpload,
    onRemove: handleRemove,
    onImageLoad,
    onImageError,
    onReUpload: handleReUpload,
    onClear: handleClear,
  }
}
