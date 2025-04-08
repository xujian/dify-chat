'use client'
import { cn } from '@/lib/utils'
import { FC, useContext, useEffect, useRef, useState } from 'react'
import { useTranslation } from "react-i18next"
import { Input } from "../ui/input"
import { TextareaAutosize } from "../ui/textarea-autosize"
import { CirclePlus, CircleStop, SendHorizonal, SendIcon, StopCircle } from 'lucide-react'
import { ChatItem, VisionFile, VisionSettings, WorkflowRunningStatus } from '@/types/app'
import ChatImageUploader from '@/app/components/base/image-uploader/chat-image-uploader'
import ImageList from '@/app/components/base/image-uploader/image-list'
import { useImageFiles } from '../base/image-uploader/hooks'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/app/store'
import { sendChatMessage } from '@/service'
import produce from 'immer'
import { setResponding } from '@/app/store/session'
const InputBox: FC<ChatInputProps> = () => {

  const { t } = useTranslation()
  const chatInputRef = useRef<HTMLTextAreaElement>(null)
  const session = useSelector((state: RootState) => state.session)
  const dispatch = useDispatch<AppDispatch>()
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

  const send = async (message: string, files?: VisionFile[]) => {
    // if (isResponding) {
    //   notify({ type: 'info', message: t('app.errorMessage.waitForResponse') })
    //   return
    // }
    const data: Record<string, any> = {
      inputs: {}, //currInputs,
      query: message,
      conversation_id: session.currentConversation.id,
    }

    const questionId = `question-${Date.now()}`
    const questionItem = {
      id: questionId,
      content: message,
      isAnswer: false,
      message_files: files,
    }

    const placeholderAnswerId = `answer-placeholder-${Date.now()}`
    const placeholderAnswerItem = {
      id: placeholderAnswerId,
      content: '',
      isAnswer: true,
    }

    let isAgentMode = false

    // answer
    const responseItem: ChatItem = {
      id: `${Date.now()}`,
      content: '',
      agent_thoughts: [],
      message_files: [],
      isAnswer: true,
    }
    let hasSetResponseId = false

    const prevTempNewConversationId = session.currentConversation.id || '-1'
    let tempNewConversationId = ''

    const [abortController, setAbortController] = useState<AbortController | null>(null)

    // dispatch(setResponding(true))
    sendChatMessage(data, {
      getAbortController: (abortController) => {
        setAbortController(abortController)
      },
      onData: (message: string, isFirstMessage: boolean, { conversationId: newConversationId, messageId, taskId }: any) => {
        if (!isAgentMode) {
          responseItem.content = responseItem.content + message
        }
        else {
          const lastThought = responseItem.agent_thoughts?.[responseItem.agent_thoughts?.length - 1]
          if (lastThought)
            lastThought.thought = lastThought.thought + message // need immer setAutoFreeze
        }
        if (messageId && !hasSetResponseId) {
          responseItem.id = messageId
          hasSetResponseId = true
        }

        if (isFirstMessage && newConversationId)
          tempNewConversationId = newConversationId
      },
      async onCompleted(hasError?: boolean) {
        if (hasError)
          return
      },
      onFile(file) {
        const lastThought = responseItem.agent_thoughts?.[responseItem.agent_thoughts?.length - 1]
        if (lastThought)
          lastThought.message_files = [...(lastThought as any).message_files, { ...file }]
      },
      onThought(thought) {
        isAgentMode = true
        const response = responseItem as any
        if (thought.message_id && !hasSetResponseId) {
          response.id = thought.message_id
          hasSetResponseId = true
        }
        // responseItem.id = thought.message_id;
        if (response.agent_thoughts.length === 0) {
          response.agent_thoughts.push(thought)
        }
        else {
          const lastThought = response.agent_thoughts[response.agent_thoughts.length - 1]
          // thought changed but still the same thought, so update.
          if (lastThought.id === thought.id) {
            thought.thought = lastThought.thought
            thought.message_files = lastThought.message_files
            responseItem.agent_thoughts![response.agent_thoughts.length - 1] = thought
          }
          else {
            responseItem.agent_thoughts!.push(thought)
          }
        }
      },
      onMessageEnd: (messageEnd) => {
        if (messageEnd.metadata?.annotation_reply) {
          responseItem.id = messageEnd.id
          responseItem.annotation = ({
            id: messageEnd.metadata.annotation_reply.id,
            authorName: messageEnd.metadata.annotation_reply.account.name,
          } as AnnotationType)
          return
        }
      },
      onMessageReplace: (messageReplace) => {
        console.log('onMessageReplace', messageReplace)
      },
      onError() {
        dispatch(setResponding(false))
      },
      onWorkflowStarted: ({ workflow_run_id, task_id }) => {
        // taskIdRef.current = task_id
        responseItem.workflow_run_id = workflow_run_id
        responseItem.workflowProcess = {
          status: WorkflowRunningStatus.Running,
          tracing: [],
        }
      },
      onWorkflowFinished: ({ data }) => {
        console.log('onWorkflowFinished', data)
        responseItem.workflowProcess!.status = data.status as WorkflowRunningStatus
      },
      onNodeStarted: ({ data }) => {
        responseItem.workflowProcess!.tracing!.push(data as any)
      },
      onNodeFinished: ({ data }) => {
        console.log('onNodeFinished', data, responseItem)
        const currentIndex = responseItem.workflowProcess!.tracing!.findIndex(item => item.node_id === data.node_id)
        responseItem.workflowProcess!.tracing[currentIndex] = data as any
        if (data.node_type === 'code' && data.outputs.format === 'json') {
          responseItem.format = 'json'
          responseItem.customContent = data.outputs.result
        }
        console.log('onNodeFinished------', data, responseItem)
      },
    })
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
                  send(userInput)
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