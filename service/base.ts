import { API_PREFIX } from '@/config'
import {
  type AnnotationReply, type EndMessage, type Media, type MessageReplace, type Thought,
  type Workflow, type WorkflowStatus, type WorkflowNode,
  NodeStatus
} from '@/models'
import { toast } from '@/components/toast'

const TIME_OUT = 100000

const ContentType = {
  json: 'application/json',
  stream: 'text/event-stream',
  form: 'application/x-www-form-urlencoded; charset=UTF-8',
  download: 'application/octet-stream', // for download
}

const baseOptions = {
  method: 'GET',
  mode: 'cors',
  credentials: 'include', // always send cookies、HTTP Basic authentication.
  headers: new Headers({
    'Content-Type': ContentType.json,
  }),
  redirect: 'follow',
}

export type OnDataMoreInfo = {
  conversationId?: string
  taskId?: string
  messageId: string
  errorMessage?: string
  errorCode?: string
}

export type OnData = (message: string, isFirstMessage: boolean, moreInfo: OnDataMoreInfo) => void
export type OnThought = (though: Thought) => void
export type OnFile = (file: Media) => void
export type OnMessageEnd = (messageEnd: EndMessage) => void
export type OnMessageReplace = (messageReplace: MessageReplace) => void
export type OnAnnotationReply = (messageReplace: AnnotationReply) => void
export type OnCompleted = (hasError?: boolean) => void
export type OnError = (msg: string, code?: string) => void
export type OnWorkflowStarted = (workflow: Workflow) => void
export type OnWorkflowFinished = (workflow: Workflow) => void
export type OnNodeStarted = (node: WorkflowNode) => void
export type OnNodeFinished = (node: WorkflowNode) => void

type OtherOptions = {
  isPublicAPI?: boolean
  bodyStringify?: boolean
  needAllResponseContent?: boolean
  deleteContentType?: boolean
  onData?: OnData // for stream
  onThought?: OnThought
  onFile?: OnFile
  onMessageEnd?: OnMessageEnd
  onMessageReplace?: OnMessageReplace
  onError?: OnError
  onCompleted?: OnCompleted // for stream
  getAbortController?: (abortController: AbortController) => void
  onWorkflowStarted?: OnWorkflowStarted
  onWorkflowFinished?: OnWorkflowFinished
  onNodeStarted?: OnNodeStarted
  onNodeFinished?: OnNodeFinished
}

function unicodeToChar(text: string) {
  return text.replace(/\\u([0-9a-f]{4})/gi, (_, hex) => {
    return String.fromCharCode(parseInt(hex, 16))
  })
}

function safeJsonParse(text: string, fallback: any = null) {
  if (!text || typeof text !== 'string') return text;

  try {
    const unicodeFixed = unicodeToChar(text);
    return JSON.parse(unicodeFixed);
  } catch (err) {
    console.error('Error parsing JSON:', err);
    return fallback !== null ? fallback : text;
  }
}

const handleStream = (
  response: Response,
  onData: OnData,
  onCompleted?: OnCompleted,
  onThought?: OnThought,
  onMessageEnd?: OnMessageEnd,
  onMessageReplace?: OnMessageReplace,
  onFile?: OnFile,
  onWorkflowStarted?: OnWorkflowStarted,
  onWorkflowFinished?: OnWorkflowFinished,
  onNodeStarted?: OnNodeStarted,
  onNodeFinished?: OnNodeFinished,
) => {
  if (!response.ok)
    throw new Error('Network response was not ok')

  const reader = response.body?.getReader()
  const decoder = new TextDecoder('utf-8')
  let buffer = ''
  let chunk: Record<string, any>
  let isFirstMessage = true
  function read() {
    let hasError = false
    reader?.read().then((result: any) => {
      if (result.done) {
        onCompleted && onCompleted()
        return
      }
      buffer += decoder.decode(result.value, { stream: true })
      const lines = buffer.split('\n\n')
      try {
        lines.forEach((message) => {
          if (message.startsWith('data: ')) { // check if it starts with data:
            const m = message.substring(6)
            try {
              // Pre-process the message to handle potential Unicode escape issues
              const u = unicodeToChar(m)
              console.log('(0)(0)(0)(0)(0)(0)(0)(0)(0)(0)(0)(0)u', u)
              chunk = JSON.parse(u) as Record<string, any>
              console.log('(0)(0)(0)(0)(0)(0)(0)(0)(0)(0)(0)(0)bufferObj', chunk)
            }
            catch (e) {
              console.error('(0)(0)(0)(0)(0)(0)(0)(0)(0)(0)(0)(0)error1', m, e)
              // mute handle message cut off
              onData('', isFirstMessage, {
                conversationId: chunk?.conversation_id,
                messageId: chunk?.message_id,
              })
              return false
            }
            if (chunk.status === 400 || !chunk.event) {
              onData('', false, {
                conversationId: undefined,
                messageId: '',
                errorMessage: chunk?.message,
                errorCode: chunk?.code,
              })
              hasError = true
              onCompleted?.(true)
              return false
            }
            if (chunk.event === 'message' || chunk.event === 'agent_message') {
              console.log('(0)(0)(0)(0)(0)(0)(0)(0)(0)(0)(0)(0) ===message===bufferObj.answer', chunk.answer)
              // can not use format here. Because message is splited.
              onData(unicodeToChar(chunk.answer), isFirstMessage, {
                conversationId: chunk.conversation_id,
                taskId: chunk.task_id,
                messageId: chunk.id,
              })
              isFirstMessage = false
            }
            else if (chunk.event === 'agent_thought') {
              onThought?.(chunk as Thought)
            }
            else if (chunk.event === 'message_file') {
              onFile?.(chunk as File)
            }
            else if (chunk.event === 'message_end') {
              onMessageEnd?.({
                id: chunk.id,
                metadata: {
                  citations: chunk.metadata.retriever_resources?.map((resource: any) => ({
                    id: resource.id,
                    title: resource.dataset_name,
                    url: resource.url,
                    content: resource.content,
                  }))
                }
              })
            }
            else if (chunk.event === 'message_replace') {
              onMessageReplace?.(chunk as MessageReplace)
            }
            else if (chunk.event === 'workflow_started') {
              console.log('(0)(0)(0)(0)(0)(0)(0)(0)(0)(0)(0)(0)workflow_started---chunk.data', chunk)
              onWorkflowStarted?.({
                createdAt: chunk.created_at,
                id: chunk.data.node_id,
              })
            }
            else if (chunk.event === 'workflow_finished') {
              console.log('(0)(0)(0)(0)(0)(0)(0)(0)(0)(0)(0)(0)workflow_finished---chunk.data', chunk)
              onWorkflowFinished?.({
                id: chunk.data.workflow_id,
                status: chunk.data.status,
                error: chunk.data.error,
                createdAt: chunk.data.created_at,
                time: chunk.data.elapsed_time,
                metadata: {
                  totalTokens: chunk.data.total_tokens,
                  totalSteps: chunk.data.total_steps,
                },
              })
            }
            else if (chunk.event === 'node_started') {
              console.log('(0)(0)(0)(0)(0)(0)(0)(0)(0)(0)(0)(0)node_started---chunk.data', chunk)
              onNodeStarted?.({
                id: chunk.data.node_id,
                type: chunk.data.node_type,
                title: chunk.data.title,
                createdAt: chunk.data.created_at,
                status: NodeStatus.Running,
              })
            }
            else if (chunk.event === 'node_finished') {
              console.log('(0)(0)(0)(0)(0)(0)(0)(0)(0)(0)(0)(0)node_finished---chunk.data', chunk)
              onNodeFinished?.({
                id: chunk.data.id,
                type: chunk.data.node_type,
                title: chunk.data.node_title,
                status: chunk.data.status,
                error: chunk.data.error,
                time: chunk.data.elapsed_time,
                createdAt: chunk.data.created_at,
                output: chunk.data.outputs,
                metadata: {
                  totalTokens: chunk.data.execution_metadata?.total_tokens,
                  totalPrice: chunk.data.execution_metadata?.total_price,
                }
              })
            }
          }
        })
        buffer = lines[lines.length - 1]
      }
      catch (e) {
        console.error('(0)(0)(0)(0)(0)(0)(0)(0)(0)(0)(0)(0)error2', e)
        onData('', false, {
          conversationId: undefined,
          messageId: '',
          errorMessage: `${e}`,
        })
        hasError = true
        onCompleted?.(true)
        return
      }
      if (!hasError)
        read()
    })
  }
  read()
}

const baseFetch = (url: string, fetchOptions: any, { needAllResponseContent }: OtherOptions) => {
  const options = Object.assign({}, baseOptions, fetchOptions)

  const urlPrefix = API_PREFIX

  let urlWithPrefix = `${urlPrefix}${url.startsWith('/') ? url : `/${url}`}`

  const { method, params, body } = options
  // handle query
  if (method === 'GET' && params) {
    const paramsArray: string[] = []
    Object.keys(params).forEach(key =>
      paramsArray.push(`${key}=${encodeURIComponent(params[key])}`),
    )
    if (urlWithPrefix.search(/\?/) === -1)
      urlWithPrefix += `?${paramsArray.join('&')}`

    else
      urlWithPrefix += `&${paramsArray.join('&')}`

    delete options.params
  }

  if (body)
    options.body = JSON.stringify(body)

  // Handle timeout
  return Promise.race([
    new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('request timeout'))
      }, TIME_OUT)
    }),
    new Promise((resolve, reject) => {
      globalThis.fetch(urlWithPrefix, options)
        .then((res: any) => {
          const resClone = res.clone()
          // Error handler
          if (!/^(2|3)\d{2}$/.test(res.status)) {
            try {
              const bodyJson = res.json()
              switch (res.status) {
                case 401: {
                  toast({ type: 'error', message: 'Invalid token' })
                  return
                }
                default:
                  // eslint-disable-next-line no-new
                  new Promise(() => {
                    bodyJson.then((data: any) => {
                      toast({ type: 'error', message: data.message })
                    })
                  })
              }
            }
            catch (e) {
              toast({ type: 'error', message: `${e}` })
            }

            return Promise.reject(resClone)
          }

          // handle delete api. Delete api not return content.
          if (res.status === 204) {
            resolve({ result: 'success' })
            return
          }

          // return data
          const data = options.headers.get('Content-type') === ContentType.download ? res.blob() : res.json()

          resolve(needAllResponseContent ? resClone : data)
        })
        .catch((err) => {
          console.error('(0)(0)(0)(0)(0)(0)(0)(0)(0)(0)(0)(0)error3', err)
          toast({ type: 'error', message: err })
          reject(err)
        })
    }),
  ])
}

export const upload = (fetchOptions: any): Promise<any> => {
  const urlPrefix = API_PREFIX
  const urlWithPrefix = `${urlPrefix}/file-upload`
  const defaultOptions = {
    method: 'POST',
    url: `${urlWithPrefix}`,
    data: {},
  }
  const options = {
    ...defaultOptions,
    ...fetchOptions,
  }
  return new Promise((resolve, reject) => {
    const xhr = options.xhr
    xhr.open(options.method, options.url)
    for (const key in options.headers)
      xhr.setRequestHeader(key, options.headers[key])

    xhr.withCredentials = true
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200)
          resolve({ id: xhr.response })
        else
          reject(xhr)
      }
    }
    xhr.upload.onprogress = options.onprogress
    xhr.send(options.data)
  })
}

export const ssePost = (
  url: string,
  fetchOptions: any,
  {
    onData,
    onCompleted,
    onThought,
    onFile,
    onMessageEnd,
    onMessageReplace,
    onWorkflowStarted,
    onWorkflowFinished,
    onNodeStarted,
    onNodeFinished,
    onError,
  }: OtherOptions,
) => {
  const options = Object.assign({}, baseOptions, {
    method: 'POST',
  }, fetchOptions)

  const urlPrefix = API_PREFIX
  const urlWithPrefix = `${urlPrefix}${url.startsWith('/')
    ? url
    : `/${url}`}`

  const { body } = options
  if (body)
    options.body = JSON.stringify(body)

  globalThis.fetch(urlWithPrefix, options)
    .then((res: any) => {
      if (!/^(2|3)\d{2}$/.test(res.status)) {
        // eslint-disable-next-line no-new
        new Promise(() => {
          res.json().then((data: any) => {
            toast({ type: 'error', message: data.message || 'Server Error' })
          })
        })
        onError?.('Server Error')
        return
      }
      return handleStream(
        res,
        (str: string, isFirstMessage: boolean, moreInfo: OnDataMoreInfo) => {
          if (moreInfo.errorMessage) {
            toast({ type: 'error', message: moreInfo.errorMessage })
            return
          }
          onData?.(str, isFirstMessage, moreInfo)
        },
        () => {
          onCompleted?.()
        },
        onThought,
        onMessageEnd,
        onMessageReplace,
        onFile,
        onWorkflowStarted,
        onWorkflowFinished,
        onNodeStarted,
        onNodeFinished
      )
    }).catch((e) => {
      console.error('(0)(0)(0)(0)(0)(0)(0)(0)(0)(0)(0)(0)error4', e)
      toast({ type: 'error', message: e })
      onError?.(e)
    })
}

export const request = (url: string, options = {}, otherOptions?: OtherOptions) => {
  return baseFetch(url, options, otherOptions || {})
}

export const get = (url: string, options = {}, otherOptions?: OtherOptions) => {
  return request(url, Object.assign({}, options, { method: 'GET' }), otherOptions)
}

export const post = (url: string, options = {}, otherOptions?: OtherOptions) => {
  return request(url, Object.assign({}, options, { method: 'POST' }), otherOptions)
}

export const put = (url: string, options = {}, otherOptions?: OtherOptions) => {
  return request(url, Object.assign({}, options, { method: 'PUT' }), otherOptions)
}

export const remove = (url: string, options = {}, otherOptions?: OtherOptions) => {
  return request(url, Object.assign({}, options, { method: 'DELETE' }), otherOptions)
}
