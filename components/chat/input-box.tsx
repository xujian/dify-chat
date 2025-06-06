'use client'
import { cn } from '@/lib/utils'
import { FC, useRef, useState, KeyboardEvent as ReactKeyboardEvent, useMemo } from 'react'
import { useTranslation } from "react-i18next"
import { TextareaAutosize } from "../ui/textarea-autosize"
import { Camera, CircleStop, SendHorizonal } from 'lucide-react'
import FileUploader from '@/components/upload/file-uploader'
import FileList from '@/components/upload/file-list'
import { useUploadedFiles } from '../upload/hooks'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store'
import { generationConversationName, sendChatMessage, SendChatMessageData } from '@/service'
import { setCurrentConversation, setResponding } from '@/store/session'
import { addMessage, updateMessage } from '@/store/messages'
import { Annotation, Message, Media, Thought, EndMessage, MessageReplace, WorkflowNode, Workflow } from '@/models'
import { WorkflowStatus } from '@/models'
import { patchConversation, updateConversation } from '@/store/conversations'
import { produce } from 'immer'
import { Button } from '../ui/button'
import { useCapture } from '@/hooks/use-capture'
import { APP_INFO } from '@/config'
import { useServer } from '@/context/server'
import Suggestions from '../suggestions'

interface InputBoxProps { }

const InputBox: FC<InputBoxProps> = () => {

  const { config } = useServer()
  const { t } = useTranslation()
  const session = useSelector((state: RootState) => state.session)
  /**
   * to store conversationId and wait to be updated
   * when first message posted
   */
  const conversationRef = useRef<string>(session.currentConversation)
  const dispatch = useDispatch<AppDispatch>()
  const [query, setQuery] = useState<string>('')
  const [abortController, setAbortController] = useState<AbortController | null>(null)
  const { capture } = useCapture()
  const {
    files,
    onUpload,
    onRemove,
    onReUpload,
    onImageLoad,
    onImageError,
    onClear: clearUploadedFiles,
  } = useUploadedFiles()

  const isWeixin = useMemo(() => {
    return window.navigator.userAgent.includes('MicroMessenger')
  }, [])

  const handleInputChange = (value: string) => {
    setQuery(value)
  }

  const handleStopMessage = () => {
    setResponding(false)
    if (abortController) {
      abortController.abort()
    }
  }

  const handleCapture = () => {
    capture().then((image: Media | null) => {
      console.log('handleCapture', image)
      if (image) {
        onUpload({
          id: `${Date.now()}`,
          type: 'image',
          name: image.name || 'capture.png',
          size: image.size,
          url: image.url,
          progress: 100,
          transferMethod: 'local',
        })
      }
    })
  }

  const send = async (message: string) => {
    if (session.responding) {
      return
    }
    setQuery('')
    clearUploadedFiles()
    const data: SendChatMessageData = {
      query: message,
      conversationId: session.currentConversation,
      inputs: {
        ...session.variables,
      }
    }

    const t = Date.now()
    // placeholder question
    let question: Message = {
      id: `question-${t}`,
      content: message,
      conversationId: session.currentConversation,
      createdAt: t,
      type: 'question',
      files: files,
    }
    console.log('💬💬💬💬💬💬💬💬💬💬💬💬💬💬💬💬💬💬💬💬💬💬addMessage', question)
    dispatch(addMessage(question))

    // placeholder answer
    const initialAnswer: Message = {
      id: `answer-${t}`,
      content: '',
      type: 'answer',
      conversationId: session.currentConversation,
      createdAt: t,
      files: files,
      workflow: {
        id: '',
        status: WorkflowStatus.Running,
        nodes: [],
      }
    }

    // Keep a mutable working copy of answer that we'll use for updates
    let answer = produce(initialAnswer, draft => { })
    console.log('🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈addMessage', answer)
    dispatch(addMessage(answer))
    let isAgentMode = false
    const commit = (message: Message) => {
      dispatch(updateMessage(message))
    }

    // loading animation
    dispatch(setResponding(true))
    console.log('send-----------------data', data, files)
    sendChatMessage({
      ...data,
      files
    }, {
      getAbortController: (abortController) => {
        setAbortController(abortController)
      },
      onData: (
        message: string,
        isFirstMessage: boolean,
        {
          conversationId: newConversationId,
          messageId,
          taskId
        }: any) => {
        if (isFirstMessage) {
          console.log('onData-----------------newConversationId', isFirstMessage, newConversationId)
          dispatch(patchConversation(newConversationId))
          conversationRef.current = newConversationId
          dispatch(setCurrentConversation(newConversationId))
          answer = produce(answer, draft => {
            draft.id = `answer-${messageId}`
          })
          console.log('🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈nData-----------------updateMessage', answer)
          commit(answer)
          location.hash = `#${newConversationId}`
        }
        answer = produce(answer, draft => {
          if (!isAgentMode) {
            draft.content += message
          }
          else {
            const lastThought = draft.thoughts?.[draft.thoughts.length - 1]
            if (lastThought) {
              lastThought.content += message
            }
          }
        })
        // Use Immer's produce to create a new immutable state
        commit(answer)
      },
      async onCompleted(hasError?: boolean) {
        console.log('onCompleted', hasError)
        if (hasError)
          return
        dispatch(setResponding(false))
        // refresh conversation name
        console.log('onCompleted---XXX---', conversationRef.current)
        const generated = await generationConversationName(conversationRef.current)
        dispatch(updateConversation({
          id: conversationRef.current,
          name: generated.name
        }))
      },
      onFile(file: Media) {
        answer = produce(answer, draft => {
          const lastThought = draft.thoughts?.[draft.thoughts.length - 1]
          if (lastThought) {
            lastThought.files = [...(lastThought.files || []), { ...file }]
          }
        })
        commit(answer)
      },
      onThought(thought: Thought) {
        console.log('onThought///////////////////////////////////////////////////////////////', thought)
        isAgentMode = true
        answer = produce(answer, draft => {
          // Initialize thoughts array if it doesn't exist
          if (!draft.thoughts) {
            draft.thoughts = []
          }
          if (draft.thoughts.length === 0) {
            draft.thoughts.push(thought)
          } else {
            const lastThoughtIndex = draft.thoughts.length - 1
            const lastThought = draft.thoughts[lastThoughtIndex]
            // Update existing thought or add new one
            if (lastThought.id === thought.id) {
              draft.thoughts[lastThoughtIndex] = {
                ...thought,
                content: lastThought.content,
                files: lastThought.files
              }
            } else {
              draft.thoughts.push(thought)
            }
          }
        })
        commit(answer)
      },
      onMessageEnd: (end: EndMessage) => {
        console.log('onMessageEnd', end)
        if (end.metadata?.annotation) {
          answer = produce(answer, draft => {
            if (end.metadata?.annotation) {
              draft.annotation = {
                id: end.metadata.annotation.id,
                authorName: end.metadata.annotation.account.name,
              } as Annotation
            }
          })
          commit(answer)
        }
      },
      onMessageReplace: (messageReplace: MessageReplace) => {
        console.log('onMessageReplace', messageReplace)
      },
      onError() {
        dispatch(setResponding(false))
      },
      onWorkflowStarted: (data: Workflow) => {
        if (!APP_INFO.useWorkflow) {
          return
        }
        answer = produce(answer, draft => {
          draft.workflow = {
            id: data.id,
            status: WorkflowStatus.Running,
            nodes: [],
          }
        })
        commit(answer)
      },
      onWorkflowFinished: (data: Workflow) => {
        if (!APP_INFO.useWorkflow) {
          return
        }
        console.log('onWorkflowFinished', data)
        answer = produce(answer, draft => {
          if (draft.workflow) {
            draft.workflow.status = data.status as WorkflowStatus
          }
        })
        commit(answer)
      },
      onNodeStarted: (data: WorkflowNode) => {
        if (!APP_INFO.useWorkflow) {
          return
        }
        answer = produce(answer, draft => {
          if (draft.workflow && draft.workflow.nodes) {
            draft.workflow.nodes.push(data)
          }
        })
        commit(answer)
      },
      onNodeFinished: (node: WorkflowNode) => {
        if (!APP_INFO.useWorkflow) {
          return
        }
        console.log('onNodeFinished', node)
        try {
          answer = produce(answer, draft => {
            if (draft.workflow && draft.workflow.nodes) {
              const currentIndex = draft.workflow.nodes.findIndex(
                item => item.id === node.id
              )
              if (currentIndex !== -1) {
                draft.workflow.nodes[currentIndex] = {
                  ...draft.workflow.nodes[currentIndex],
                  status: node.status,
                  error: node.error,
                  time: node.time,
                  output: node.output
                }
              }
              if (node.type === 'code' && node.output.format === 'json') {
                draft.format = 'json'
                draft.customContent = node.output.result
              }
            }
          })
          commit(answer)
        }
        catch (e) {
          console.log('onNodeFinished------error', e)
        }
        console.log('onNodeFinished------', node, answer)
      },
    })
  }

  const handleKeyDown = (event: ReactKeyboardEvent<Element>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      send(query)
    }
  }

  const handleSuggestionPick = (suggestion: string) => {
    setQuery(suggestion)
    send(suggestion)
  }

  return (
    <div className="relative my-3 flex flex-col w-full">
      {APP_INFO.useSuggestions && <Suggestions onPick={handleSuggestionPick} />}
      <div className="w-full flex flex-col justify-between border rounded-lg focus-within:outline-none focus-within:ring-1 focus-within:ring-ring z-10">
        {files.length > 0 && (
          <div className='-mb-2'>
            <FileList
              data={files}
              onRemove={onRemove}
              onReUpload={onReUpload}
              onImageLoad={onImageLoad}
              onImageError={onImageError}
            />
          </div>
        )}
        <TextareaAutosize
          className={cn(
            [
              'ring-offset-background',
              'placeholder:text-muted-foreground',
              'focus-visible:ring-ring',
              'text-sm',
              'w-full',
              'rounded-lg',
              'focus-visible:outline-hidden',
              'disabled:cursor-not-allowed',
              'disabled:opacity-50'
            ]
          )}
          onValueChange={handleInputChange}
          onKeyDown={handleKeyDown}
          value={query}
          minRows={2}
          maxRows={4}
        />
      </div>
      <div className="flex flex-row border border-t-0 bg-gray-50 rounded-b-lg mx-2 px-2 gap-2">
        <FileUploader
          accept={config.upload.accept}
          onUpload={onUpload}
          disabled={files.length >= 2}
        />
        {!isWeixin && <Button size='icon' variant='ghost'
          title='截图'
          onClick={handleCapture}
          className='w-9 h-9'>
          <Camera className='w-6 h-6' size={6} />
        </Button>
        }
        <div className="flex flex-row grow justify-end"></div>
        <div className="flex items-center justify-center cursor-pointer hover:bg-gray-50 w-8 h-8">
          {session.responding
            ? (
              <CircleStop
                className="animate-pulse rounded bg-transparent w-4 h-4"
                onClick={handleStopMessage}
                size={30}
              />
            )
            : (
              <Button size='icon' variant='ghost'
                title='发送'
                onClick={() => {
                  if (!query) return
                  send(query)
                }}
                className='w-9 h-9'>
                <SendHorizonal
                  className={cn(
                    !query && 'cursor-not-allowed',
                    'text-gray-500'
                  )}
                />
              </Button>
            )}
        </div>
      </div>
    </div>
  )
}

export default InputBox
