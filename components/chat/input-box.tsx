'use client'
import { cn } from '@/lib/utils'
import { FC, useRef, useState } from 'react'
import { useTranslation } from "react-i18next"
import { TextareaAutosize } from "../ui/textarea-autosize"
import { CircleStop, SendHorizonal } from 'lucide-react'
import FileUploader from '@/components/upload/file-uploader'
import ImageList from '@/components/upload/image-list'
import { useUploadedFiles } from '../upload/hooks'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store'
import { generationConversationName, sendChatMessage, SendChatMessageData } from '@/service'
import { setCurrentConversation, setResponding } from '@/store/session'
import { addMessage, updateMessage } from '@/store/messages'
import { Annotation, Message, Media, Thought, EndMessage, MessageReplace, WorkflowNode, Workflow } from '@/models'
import { WorkflowStatus } from '@/models'
import { patchConversation, updateConversation } from '@/store/conversations'
interface InputBoxProps { }

const InputBox: FC<InputBoxProps> = () => {
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

  const {
    files,
    onUpload,
    onRemove,
    onReUpload,
    onImageLoad,
    onImageError,
    onClear,
  } = useUploadedFiles()

  const handleInputChange = (value: string) => {
    setQuery(value)
  }

  const handleStopMessage = () => {
    setResponding(false)
    if (abortController) {
      abortController.abort()
    }
  }

  const send = async (message: string) => {
    if (session.responding) {
      return
    }
    setQuery('')
    const data: SendChatMessageData = {
      query: message,
      conversationId: session.currentConversation,
      inputs: {
        ...session.variables,
      }
    }

    const t = Date.now()

    // placeholder question
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

    // placeholder answer
    const answerId = `answer-${t}`
    const answer: Message = {
      id: answerId,
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
        }
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
        console.log('onCompleted---XXX---', conversationRef.current)
        const generated = await generationConversationName(conversationRef.current)
        dispatch(updateConversation({
          id: conversationRef.current,
          name: generated.name
        }))
      },
      onFile(file: Media) {
        const lastThought = answer.thoughts?.[answer.thoughts?.length - 1]
        if (lastThought)
          lastThought.files = [...(lastThought as any).message_files, { ...file }]
      },
      onThought(thought: Thought) {
        console.log('onThought///////////////////////////////////////////////////////////////', thought)
        isAgentMode = true
        const response = answer as any
        if (thought.messageId && answer.id === `answer-${t}`) {
          response.id = thought.messageId
        }
        // returnedMessage.id = thought.message_id;
        if (response.agentThoughts.length === 0) {
          response.agentThoughts.push(thought)
        }
        else {
          const lastThought = response.agentThoughts[response.agentThoughts.length - 1]
          // thought changed but still the same thought, so update.
          if (lastThought.id === thought.id) {
            thought.content = lastThought.thought
            thought.files = lastThought.message_files
            answer.thoughts![response.agent_thoughts.length - 1] = thought
          }
          else {
            answer.thoughts!.push(thought)
          }
        }
      },
      onMessageEnd: (end: EndMessage) => {
        console.log('onMessageEnd', end)
        if (end.metadata?.annotation) {
          answer.id = end.id
          answer.annotation = ({
            id: end.metadata.annotation.id,
            authorName: end.metadata.annotation.account.name,
          } as Annotation)
          return
        }
      },
      onMessageReplace: (messageReplace: MessageReplace) => {
        console.log('onMessageReplace', messageReplace)
      },
      onError() {
        dispatch(setResponding(false))
      },
      onWorkflowStarted: (data: Workflow) => {
        answer.workflow = {
          id: data.id,
          status: WorkflowStatus.Running,
          nodes: [],
        }
      },
      onWorkflowFinished: (data: Workflow) => {
        console.log('onWorkflowFinished', data)
        // Create a new object instead of modifying the existing one directly
        answer.workflow = {
          ...answer.workflow!,
          status: data.status as WorkflowStatus
        }
      },
      onNodeStarted: (data: WorkflowNode) => {
        try {
          answer.workflow!.nodes = [
            ...answer.workflow!.nodes!,
            data
          ]
        }
        catch (e) {
          console.log('onNodeStarted------error-x-x-x-x-x-x-x-x-x-x-x-x-xx-x-x-x-', e)
        }
      },
      onNodeFinished: (node: WorkflowNode) => {
        console.log('onNodeFinished', node, answer)
        const currentIndex = answer.workflow!.nodes!.findIndex(
          item => item.id === node.id
        )
        if (currentIndex !== -1) {
          const n = answer.workflow?.nodes?.[currentIndex]
          if (n) {
            n.status = node.status
            n.error = node.error
            n.time = node.time
            n.output = node.output
            try {
              answer.workflow!.nodes![currentIndex] = n
            }
            catch (e) {
              console.log('onNodeFinished------error', e)
            }
          }
        }
        if (node.type === 'code' && node.output.format === 'json') {
          answer.format = 'json'
          answer.customContent = node.output.result
        }
        console.log('onNodeFinished------', node, answer)
      },
    })
  }

  return (
    <div className="relative my-3 flex flex-col w-full">
      <div className="w-full flex flex-col justify-between border rounded-lg">
        {files.length > 0 && (
          <ImageList
            list={files}
            onRemove={onRemove}
            onReUpload={onReUpload}
            onImageLoad={onImageLoad}
            onImageError={onImageError}
          />
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
          value={query}
          minRows={2}
          maxRows={4}
        />
      </div>
      <div className="flex flex-row border border-t-0 bg-gray-50 rounded-b-lg mx-2 p-1">
        <FileUploader
          onUpload={onUpload}
          disabled={files.length >= 2}
        />
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
              <SendHorizonal
                className={cn(
                  'w-4 h-4',
                  !query && 'cursor-not-allowed',
                  'text-gray-500'
                )}
                onClick={() => {
                  if (!query) return
                  send(query)
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
