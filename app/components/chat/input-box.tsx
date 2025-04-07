'use client'
import { cn } from '@/lib/utils'
import { FC, useContext, useEffect, useRef, useState } from 'react'
import { useTranslation } from "react-i18next"
import { Input } from "../ui/input"
import { TextareaAutosize } from "../ui/textarea-autosize"
import { CirclePlus, CircleStop, SendHorizonal, SendIcon, StopCircle } from 'lucide-react'
import { VisionSettings } from '@/types/app'
import ChatImageUploader from '@/app/components/base/image-uploader/chat-image-uploader'
import ImageList from '@/app/components/base/image-uploader/image-list'
import { useImageFiles } from '../base/image-uploader/hooks'

const InputBox: FC<ChatInputProps> = () => {

  const { t } = useTranslation()
  const chatInputRef = useRef<HTMLTextAreaElement>(null)

  const [isTyping, setIsTyping] = useState<boolean>(false)
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [userInput, setUserInput] = useState<string>('')

  const {
    files,
    onUpload,
    onRemove,
    onReUpload,
    onImageLinkLoadError,
    onImageLinkLoadSuccess,
    onClear,
  } = useImageFiles()

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleInputChange = (e: any) => {
    setUserInput(e.target.value)
  }

  const handleStopMessage = () => {
    setIsTyping(false)
  }

  const handleSendMessage = (message: string) => {
    console.log(message)
  }

  return (
    <>
      <div className="border-input relative my-3 flex min-h-[60px] w-full items-center justify-center rounded-xl border-2">
        <>
          <CirclePlus
            className="absolute bottom-[12px] left-3 cursor-pointer p-1 hover:opacity-50"
            size={32}
            onClick={() => fileInputRef.current?.click()}
          />
          <div className='bottom-2 left-2 flex items-center'>
            <ChatImageUploader
              onUpload={onUpload}
              disabled={files.length >= 2}
            />
            <div className='mx-1 w-[1px] h-4 bg-black/5' />
          </div>
          <div className='pl-[52px]'>
            <ImageList
              list={files}
              onRemove={onRemove}
              onReUpload={onReUpload}
              onImageLinkLoadSuccess={onImageLinkLoadSuccess}
              onImageLinkLoadError={onImageLinkLoadError}
            />
          </div>
          <Input
            ref={fileInputRef}
            className="hidden"
            type="file"
            onChange={e => {
              if (!e.target.files) return
            }}
            accept={'*'}
          />
        </>
        <TextareaAutosize
          textareaRef={chatInputRef}
          className="ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring text-md flex w-full resize-none rounded-md border-none bg-transparent px-14 py-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          onValueChange={handleInputChange}
          value={userInput}
          minRows={1}
          maxRows={18}
          onCompositionStart={() => setIsTyping(true)}
          onCompositionEnd={() => setIsTyping(false)}
        />
        <div className="absolute bottom-[14px] right-3 cursor-pointer hover:opacity-50">
          {isGenerating
            ? (
              <CircleStop
                className="hover:bg-background animate-pulse rounded bg-transparent p-1"
                onClick={handleStopMessage}
                size={30}
              />
            )
            : (
              <SendHorizonal
                className={cn(
                  "bg-primary text-secondary rounded p-1",
                  !userInput && "cursor-not-allowed opacity-50"
                )}
                onClick={() => {
                  if (!userInput) return

                  handleSendMessage(userInput)
                }}
                size={30}
              />
            )}
        </div>
      </div>
    </>
  )
}

export default InputBox