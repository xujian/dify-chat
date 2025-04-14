'use client'
import { cn } from '@/lib/utils'
import { FC, useRef, useState } from 'react'
import { useTranslation } from "react-i18next"
import { Input } from "../ui/input"
import { TextareaAutosize } from "../ui/textarea-autosize"
import { CirclePlus, CircleStop, FilePlus, SendHorizonal } from 'lucide-react'
import ChatImageUploader from '@/components/image-uploader/chat-image-uploader'
import ImageList from '@/components/image-uploader/image-list'
import { useImageFiles } from '../image-uploader/hooks'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/app/store'
import { generationConversationName, sendChatMessage, SendChatMessageData } from '@/service'
import { setResponding } from '@/app/store/session'
import { addMessage, updateMessage } from '@/app/store/messages'
import { Annotation, Message, Media } from '@/models'
import { WorkflowRunningStatus } from '@/models/workflow'
import { updateConversation } from '@/app/store/conversations'
interface InputBoxProps { }

const InputBox: FC<InputBoxProps> = () => {
  const { t } = useTranslation()
  const session = useSelector((state: RootState) => state.session)
  const dispatch = useDispatch<AppDispatch>()
  const [isTyping, setIsTyping] = useState<boolean>(false)
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [userInput, setUserInput] = useState<string>('')
  const [abortController, setAbortController] = useState<AbortController | null>(null)

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

  const handleInputChange = (value: string) => {
    setUserInput(value)
  }

  const handleStopMessage = () => {
    setIsTyping(false)
  }

  const send = async (message: string, files?: Media[]) => {
    console.log('send', message, files)
    if (session.responding) {
      return
    }
    const data: SendChatMessageData = {
      query: message,
      conversationId: session.currentConversation,
      inputs: {
        phone: '13800138000',
        age: 20,
        gender: '男',
      },
    }

    const t = Date.now()
    const questionId = `question-${t}`
    const question: Message = {
      id: questionId,
      content: message,
      conversationId: session.currentConversation,
      createdAt: t,
      type: 'question',
      files: files,
    }
    dispatch(addMessage(question))

    const answerId = `answer-${t}`
    const answer: Message = {
      id: answerId,
      content: '',
      type: 'answer',
      conversationId: session.currentConversation,
      createdAt: t,
      files: files,
      workflowRunId: '',
      workflowProcess: {
        status: WorkflowRunningStatus.Running,
        tracing: [],
      }
    }

    dispatch(addMessage(answer))

    let isAgentMode = false

    const commit = (message: Message) => {
      dispatch(updateMessage(message))
    }

    // loading animation
    dispatch(setResponding(true))
    sendChatMessage(data, {
      getAbortController: (abortController) => {
        setAbortController(abortController)
      },
      onData: (
        message: string,
        isFirstMessage: boolean, {
          conversationId: newConversationId,
          messageId,
          taskId
        }: any) => {
        console.log('onData', message, isFirstMessage, newConversationId, messageId, taskId)
        if (!isAgentMode) {
          answer.content += message
        }
        else {
          const lastThought = answer.thoughts?.[answer.thoughts?.length - 1]
          if (lastThought)
            lastThought.content = lastThought.content + message // need immer setAutoFreeze
        }
        if (messageId && answer.id === `answer-${t}`) {
          answer.id = `answer-${messageId}`
          question.id = `question-${messageId}`
          commit(question)
        }
        commit(answer)
      },
      async onCompleted(hasError?: boolean) {
        console.log('onCompleted', hasError)
        if (hasError)
          return
        dispatch(setResponding(false))
        // refresh conversation name
        const conversation = await generationConversationName(session.currentConversation)
        dispatch(updateConversation({
          id: session.currentConversation,
          name: conversation.name
        }))
      },
      onFile(file) {
        const lastThought = answer.thoughts?.[answer.thoughts?.length - 1]
        if (lastThought)
          lastThought.files = [...(lastThought as any).message_files, { ...file }]
      },
      onThought(thought) {
        isAgentMode = true
        const response = answer as any
        if (thought.message_id && answer.id === `answer-${t}`) {
          response.id = thought.message_id
        }
        // returnedMessage.id = thought.message_id;
        if (response.agent_thoughts.length === 0) {
          response.agent_thoughts.push(thought)
        }
        else {
          const lastThought = response.agent_thoughts[response.agent_thoughts.length - 1]
          // thought changed but still the same thought, so update.
          if (lastThought.id === thought.id) {
            thought.thought = lastThought.thought
            thought.message_files = lastThought.message_files
            answer.thoughts![response.agent_thoughts.length - 1] = thought
          }
          else {
            answer.thoughts!.push(thought)
          }
        }
      },
      onMessageEnd: (messageEnd) => {
        console.log('onMessageEnd', messageEnd)
        if (messageEnd.metadata?.annotation_reply) {
          answer.id = messageEnd.id
          answer.annotation = ({
            id: messageEnd.metadata.annotation_reply.id,
            authorName: messageEnd.metadata.annotation_reply.account.name,
          } as Annotation)
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
        console.log('onWorkflowStarted', workflow_run_id, task_id)
        // taskIdRef.current = task_id
        answer.workflowRunId = workflow_run_id
        answer.workflowProcess = {
          status: WorkflowRunningStatus.Running,
          tracing: [],
        }
      },
      onWorkflowFinished: ({ data }) => {
        console.log('onWorkflowFinished', data)
        answer.workflowProcess!.status = data.status as WorkflowRunningStatus
      },
      onNodeStarted: ({ data }) => {
        answer.workflowProcess!.tracing!.push(data as any)
      },
      onNodeFinished: ({ data }) => {
        console.log('onNodeFinished', data, answer)
        const currentIndex = answer.workflowProcess!.tracing!.findIndex(item => item.node_id === data.node_id)
        answer.workflowProcess!.tracing![currentIndex] = data as any
        if (data.node_type === 'code' && data.outputs.format === 'json') {
          answer.format = 'json'
          answer.customContent = data.outputs.result
        }
        console.log('onNodeFinished------', data, answer)
      },
    })
  }

  return (
    <div className="relative my-3 flex flex-col w-full">
      <div className="w-full flex flex-row justify-between">
        {files.length > 0 && (
          <div className='pl-[52px]'>
            <ImageList
              list={files}
              onRemove={onRemove}
              onReUpload={onReUpload}
              onImageLinkLoadSuccess={onImageLinkLoadSuccess}
              onImageLinkLoadError={onImageLinkLoadError}
            />
          </div>
        )}
        <TextareaAutosize
          className={cn(
            [
              'border',
              'ring-offset-background',
              'placeholder:text-muted-foreground',
              'focus-visible:ring-ring',
              'text-md',
              'w-full',
              'rounded-lg',
              'focus-visible:outline-hidden',
              'disabled:cursor-not-allowed',
              'disabled:opacity-50'
            ]
          )}
          onValueChange={handleInputChange}
          value={userInput}
          minRows={2}
          maxRows={4}
          onCompositionStart={() => setIsTyping(true)}
          onCompositionEnd={() => setIsTyping(false)}
        />
      </div>
      <div className="flex flex-row border border-t-0 rounded-b-lg mx-2 p-1">
        <ChatImageUploader
          onUpload={onUpload}
          disabled={files.length >= 2}
        />
        <Input
          ref={fileInputRef}
          className="hidden"
          type="file"
          onChange={e => {
            if (!e.target.files) return
          }}
          accept={'*'}
        />
        <div className="flex flex-row grow justify-end"></div>
        <div className="cursor-pointer hover:opacity-50">
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
    </div>
  )
}

export default InputBox
