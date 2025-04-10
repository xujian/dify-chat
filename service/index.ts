import type { IOnCompleted, IOnData, IOnError, IOnFile, IOnMessageEnd, IOnMessageReplace, IOnNodeFinished, IOnNodeStarted, IOnThought, IOnWorkflowFinished, IOnWorkflowStarted } from './base'
import { get, post, ssePost, remove } from './base'
import type { Media, Feedback, ServerConfig } from '@/models'

export type SendChatMessageData = {
  conversationId: string
  query: string
  files?: Media[]
  inputs?: Record<string, any>
}

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
    onData: IOnData
    onCompleted: IOnCompleted
    onFile: IOnFile
    onThought: IOnThought
    onMessageEnd: IOnMessageEnd
    onMessageReplace: IOnMessageReplace
    onError: IOnError
    getAbortController?: (abortController: AbortController) => void
    onWorkflowStarted: IOnWorkflowStarted
    onNodeStarted: IOnNodeStarted
    onNodeFinished: IOnNodeFinished
    onWorkflowFinished: IOnWorkflowFinished
  },
) => {
  const body = {
    query: data.query,
    inputs: data.inputs || {},
    conversation_id: data.conversationId === '-1'
      ? null
      : data.conversationId,
    response_mode: 'streaming',
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
  return get('conversations', { params: { limit: 100, first_id: '' } })
}

export const removeConversation = async (conversationId: string) => {
  return remove(`conversations/${conversationId}`)
}

export const getMessages = async (conversationId: string) => {
  return get('messages', { params: { conversation_id: conversationId, limit: 20, last_id: '' } })
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
    systemParameters: result.system_parameters,
    upload: {
      enabled: result.file_upload.enable
    },
    openingStatement: result.opening_statement,
    suggests: result.suggested_questions,
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
