import type {
  OnCompleted,
  OnData,
  OnError,
  OnFile,
  OnMessageEnd,
  OnMessageReplace,
  OnNodeFinished,
  OnNodeStarted,
  OnThought,
  OnWorkflowFinished,
  OnWorkflowStarted
} from './base'
import { get, post, ssePost, remove } from './base'
import type { Media, Feedback, ServerConfig } from '@/models'

export type SendChatMessageData = {
  conversationId: string
  query: string
  files?: Media[]
  inputs?: Record<string, any>
}

const transferMethodMapping = {
  remote: 'remote_url',
  local: 'local_file',
}

const reversedTransferMethodMapping = Object.entries(transferMethodMapping).reduce((acc, [key, value]) => {
  acc[value] = key
  return acc
}, {} as Record<string, string>)

export const sendChatMessage = async (
  data: SendChatMessageData,
  {
    onData,
    onCompleted,
    onThought,
    onFile,
    onError,
    getAbortController,
    onMessageEnd,
    onMessageReplace,
    onWorkflowStarted,
    onNodeStarted,
    onNodeFinished,
    onWorkflowFinished,
  }: {
    onData: OnData
    onCompleted: OnCompleted
    onFile: OnFile
    onThought: OnThought
    onMessageEnd: OnMessageEnd
    onMessageReplace: OnMessageReplace
    onError: OnError
    getAbortController?: (abortController: AbortController) => void
    onWorkflowStarted: OnWorkflowStarted
    onNodeStarted: OnNodeStarted
    onNodeFinished: OnNodeFinished
    onWorkflowFinished: OnWorkflowFinished
  },
) => {
  const body = {
    query: data.query,
    inputs: data.inputs || {},
    conversation_id: data.conversationId === '-1'
      ? null
      : data.conversationId,
    response_mode: 'streaming',
    files: data.files?.map(f =>
      f.transferMethod === 'local'
        ? {
          type: f.type,
          upload_file_id: f.uploadId,
          transfer_method: 'local_file'
        }
        : {
          type: f.type,
          transfer_method: 'remote_url',
          url: f.url
        }
    )
  }
  return ssePost('chat-messages', {
    body,
  }, {
    onData,
    onCompleted,
    onThought,
    onFile,
    onError,
    getAbortController,
    onMessageEnd,
    onMessageReplace,
    onNodeStarted,
    onWorkflowStarted,
    onWorkflowFinished,
    onNodeFinished
  })
}

export const getConversations = async () => {
  return get('conversations', { params: { limit: 100, first_id: '' } }).then((res: any) => {
    const data = res.data.map((item: any) => ({
      id: item.id,
      name: item.name.replace(/\p{Emoji}/gu, ''),
      introduction: item.introduction,
      createdAt: item.created_at,
      status: item.status,
    }))
    return {
      data,
      error: res.error,
    }
  })
}

export const removeConversation = async (conversationId: string) => {
  return remove(`conversations/${conversationId}`)
}

export const getMessages = async (conversationId: string) => {
  return get('messages', {
    params: {
      conversation_id: conversationId,
      limit: 20,
      last_id: ''
    }
  })
}

export const deleteMessage = async (messageId: string) => {
  return remove(`messages/${messageId}`)
}

// init value. wait for server update
export const fetchAppParams: () => Promise<ServerConfig> = async () => {
  const result: any = await get('parameters')
  const typeMapping: Record<string, string> = {
    'text-input': 'text',
    'select': 'select',
    'number': 'number'
  }
  return {
    upload: {
      enabled: result.file_upload.enabled,
      limit: result.file_upload.number_limits,
      accept: result.file_upload.allowed_file_types,
      allowedTransferMethods: result.file_upload.allowed_file_upload_methods
        .map((method: string) => reversedTransferMethodMapping[method]),
      sizeLimit: result.file_upload.fileUploadConfig?.file_size_limit || 20,
    },
    openingStatement: result.opening_statement,
    suggestions: result.suggested_questions.map((t: string) => ({ text: t })),
    variables: result.user_input_form.map((i: any) => {
      const t = Object.keys(i)[0],
        type = typeMapping[t] || 'text'
      return {
        label: i[t].label,
        name: i[t].variable,
        maxLength: i[t].max_length,
        options: i[t].options,
        required: i[t].required,
        type,
        default: i[t].default,
      }
    })
  }
}

export const updateFeedback = async ({ url, body }: { url: string; body: Feedback }) => {
  return post(url, { body })
}

export const generationConversationName: (id: string) => Promise<{ name: string }>
  = async (id: string) => {
    const result = await post(`conversations/${id}/name`, { body: { auto_generate: true } })
    return result as { name: string }
  }
