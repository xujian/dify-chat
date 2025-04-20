import { Message } from '@/models'
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import { deleteMessage, getMessages } from '@/service'
import { toJson } from '@/lib/utils'
import { toast } from '@/components'
import { APP_INFO } from '@/config'

export interface MessagesState {
  value: Message[]
  loading: boolean
  error: string | null
}

const initialState: MessagesState = {
  value: [],
  loading: false,
  error: null,
}

export const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    greet: (state, action: PayloadAction<string>) => {
      state.value = []
      state.value.push({
        id: '-1',
        content: action.payload,
        type: 'answer',
        conversationId: '-1',
      })
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      const message = action.payload
      state.value.push({
        ...message,
      })
    },
    updateMessage: (state, action: PayloadAction<Message>) => {
      const message = action.payload
      const index = state.value.findIndex(
        item => item.id === message.id ||
          item.id === `answer-${message.createdAt}` ||
          item.id === `question-${message.createdAt}`
      )
      if (index !== -1) {
        state.value[index] = {
          ...message,
        }
      }
    },
    clearMessages: (state) => {
      state.value = []
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false
        state.value = action.payload
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch messages'
        toast({ type: 'error', message: state.error })
      })
      .addCase(removeMessage.fulfilled, (state, action) => {
        state.value = state.value.filter(item => item.id !== action.payload)
      })
  },
})

export const { addMessage, updateMessage, clearMessages, clearError, greet } = messagesSlice.actions

export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async (conversationId: string, { rejectWithValue }) => {
    const transform = (f: any[]) => f.map(f => ({
      name: f.filename,
      id: f.id,
      type: f.type,
      url: f.url.startsWith('http')
        ? f.url
        : `${APP_INFO.server}${f.url}`,
    }))
    try {
      const response = await getMessages(conversationId)
      const { data } = response as { data: any[] }
      const result: Message[] = []

      data.forEach((item: any) => {
        const customContent = toJson(item.answer)
        result.push({
          id: `question-${item.id}`,
          conversationId: conversationId,
          content: item.query,
          type: 'question',
          files: transform(
            item.message_files
              ?.filter((file: any) => file.belongs_to === 'user') || []),
        })
        result.push({
          id: item.id,
          content: item.answer,
          conversationId: conversationId,
          format: customContent ? 'json' : 'text',
          customContent,
          type: 'answer',
          feedback: item.feedback,
          files: transform(
            item.message_files?.filter(
              (file: any) => file.belongs_to === 'assistant'
            ) || []
          ),
        })
      })
      return result
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch messages')
    }
  }
)

export const removeMessage = createAsyncThunk(
  'messages/removeMessage',
  async (messageId: string, { rejectWithValue }) => {
    try {
      const response = await deleteMessage(messageId)
      return response
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete message')
    }
  }
)

export default messagesSlice.reducer 
